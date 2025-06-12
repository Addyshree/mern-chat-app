import { getReceiverSocketId, io } from "../lib/socket.js";
import user from "../modals/message.modal.js";
import Message from "../modals/message.modal.js";
import claudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  //we  only want other users not me in sidebar
  //so taking all other users and not mine
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await user
      .find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("error in getuserdforsidebar :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; //renaaming to usertochatid
    const myId = req.user._id;

    //finds all the message which eiher i send or either i received
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
  } catch (error) {
    console.error("error in finding messages :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//message can be either an image or a text
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.oarams;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      //upload image to claudinary
      const uploadResponse = await claudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      //only sending message to receiver
      io.to(receiverSocketId).emit("new message", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("error in sending Message :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
