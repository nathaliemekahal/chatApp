const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const http = require("http");
const users = require("./users.json");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let userList = [];
let rooms = [
  {
    id: "1",
    owner: "user6",
  },
];

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("addUser", ({ username }) => {
    userList.push(username);
    console.log(userList);
  });
  socket.on("joinRoom", ({ username, opponent, roomid }) => {
    let roomExists = rooms.find((room) => room.owner === opponent);
    let roomId;
    if (roomExists) {
      socket.join(roomExists.id);
      roomId = roomExists.id;
    } else {
      rooms.push({ id: roomid, owner: username });
      socket.join(roomid);
      roomId = roomid;
    }
    console.log(roomId);
    socket.on("chatmessage", ({ text }) => {
      io.to(roomId).emit("message", { text });
    });
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

let port = process.env.port;
app.use(cors());

server.listen(port, () => {
  console.log("RUNNING ON PORT " + port);
});
