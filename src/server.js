const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const http = require("http");
const users = require("./users.json");
const userRoutes = require("./users/index.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let userList = [];
let rooms = [
  {
    id: "",
    owner: "",
    occupied: false,
    participant: "",
  },
];

io.on("connection", (socket) => {
  console.log("connected");
  console.log(socket.rooms);
  socket.on("joinRoom", ({ username, opponent, roomid }) => {
    let roomExists = rooms.find((room) => room.owner === opponent);
    if (roomExists && roomExists.occupied === false) {
      let filteredRooms = rooms.filter((room) => room.owner !== opponent);
      filteredRooms.push({
        id: roomExists.id,
        owner: roomExists.owner,
        occupied: true,
        participant: username,
      });
      rooms = filteredRooms;
      socket.join(roomExists.id, function () {
        console.log(socket.rooms);
      });
      roomId = roomExists.id;
      // console.log("room exists");
    } else {
      rooms.push({
        id: roomid,
        owner: username,
        occupied: false,
        participant: "",
      });
      socket.join(roomid, function () {
        console.log(socket.rooms);
      });
      roomId = roomid;
      // console.log("room created");
    }
    console.log(rooms);
    socket.on("chatmessage", ({ text, to }) => {
      console.log(roomId);
      io.to(roomId).emit("message", { text, to });
    });
  });
  //
  socket.on("leaveRoom", ({ username }) => {
    let room = rooms.find(
      (room) => room.owner === username || room.participant === username
    );
    if (room.participant === username) {
      let filteredRooms = rooms.filter((room) => room.participant !== username);
      filteredRooms.push({
        id: room.id,
        owner: room.owner,
        occupied: false,
        participant: "",
      });

      rooms = filteredRooms;
      socket.leave(room.id);
      console.log(rooms);
    } else if (room.owner === username) {
      let filteredRooms = rooms.filter((room) => room.owner !== username);
      filteredRooms.push({
        id: room.id,
        owner: "",
        occupied: false,
        participant: room.participant,
      });

      rooms = filteredRooms;
      socket.leave(room.id, function () {
        console.log(socket.rooms);
      });
      console.log(rooms);
    }
  });
  //
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

let port = process.env.port;
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);

mongoose
  .connect(process.env.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log(`working on port ${port}`);
    })
  );
mongoose.connection.on("connected", () => {
  console.log("connected to atlas");
});
