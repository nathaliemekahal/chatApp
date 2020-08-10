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

let rooms = [
  {
    id: "",
    user1: "",
    occupied: false,
    user2: "",
  },
];

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, opponent, roomid }) => {
    let roomId;
    let roomExists = rooms.find(
      (room) => room.user1 === opponent || room.user2 === opponent
    );
    if (roomExists && roomExists.occupied === false) {
      roomId = roomExists.id;
      if (roomExists.user1 === opponent) {
        let filteredRooms = rooms.filter((room) => room.user1 !== opponent);
        filteredRooms.push({
          id: roomExists.id,
          user1: roomExists.user1,
          occupied: true,
          user2: username,
        });
        rooms = filteredRooms;
      } else if (roomExists.user2 === opponent) {
        let filteredRooms = rooms.filter((room) => room.user2 !== opponent);
        filteredRooms.push({
          id: roomExists.id,
          user1: username,
          occupied: true,
          user2: roomExists.user2,
        });
        rooms = filteredRooms;
      }
      socket.join(roomExists.id, function () {
        console.log(socket.rooms);
      });
      roomId = roomExists.id;
    } else {
      rooms.push({
        id: roomid,
        user1: username,
        occupied: false,
        user2: "",
      });
      socket.join(roomid, function () {
        console.log(socket.rooms);
      });
      roomId = roomid;
    }
    socket.on("chatmessage", ({ text, to }) => {
      if (roomId) {
        io.to(roomId).emit("message", { text, to });
      }
    });
    //LEAVE ROOM
    socket.on("leaveRoom", ({ username }) => {
      let room = rooms.find(
        (room) => room.user1 === username || room.user2 === username
      );
      if (room.user2 === username) {
        let filteredRooms = rooms.filter((room) => room.user2 !== username);
        filteredRooms.push({
          id: room.id,
          user1: room.user1,
          occupied: false,
          user2: "",
        });

        rooms = filteredRooms;
        socket.leave(room.id, function () {
          roomId = "";
        });
      } else if (room.user1 === username) {
        let filteredRooms = rooms.filter((room) => room.user1 !== username);
        filteredRooms.push({
          id: room.id,
          user1: "",
          occupied: false,
          user2: room.user2,
        });

        rooms = filteredRooms;
        socket.leave(room.id, function () {
          roomId = "";
        });
      }
    });
    //
  });
  //

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
