import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Socket } from "dgram";
import { log } from "console";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

//will give socket id corressponding to user ID
export function getReceiverSocketId(userId) {
  return userSocketMap(userId);
}

//to store online users
const userSocketMap = {}; //{userId : socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  //io.emit() =>  broadcast events to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

export { io, app, server };
