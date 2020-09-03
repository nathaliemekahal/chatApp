const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const http = require("http");
const users = require("./users.json");
const userRoutes = require("./users/index.js");
const msgRoutes = require("./msgs/index");
let rooms = require("./rooms/data.json");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);
/*

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
        console.log("join", rooms);
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
        console.log("join", rooms);
      });
      roomId = roomid;
    }
    socket.on("chatmessage", ({ from, text, to }) => {
      console.log(roomId);
      if (roomId) {
        io.to(roomId).emit("message", { from, text, to });
      }
    });
    //LEAVE ROOM
    socket.on("leaveRoom", ({ username }) => {
      let room = rooms.find(
        (room) => room.user1 === username || room.user2 === username
      );
      if (room) {
        if (room.user2 === username) {
          let filteredRooms = rooms.filter((room) => room.user2 !== username);
          filteredRooms.push({
            id: room.id,
            user1: room.user1,
            occupied: false,
            user2: "",
          });

          rooms = filteredRooms;
          socket.leave(room.id);
          console.log("leave1", rooms);
        } else if (room.user1 === username) {
          let filteredRooms = rooms.filter((room) => room.user1 !== username);
          filteredRooms.push({
            id: room.id,
            user1: "",
            occupied: false,
            user2: room.user2,
          });

          rooms = filteredRooms;
          socket.leave(room.id);

          console.log("leave2", rooms);
        }
      }
      roomId = "";
    });
    //
  });
  //

  //
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
*/

io.on("connection", (socket) => {
  let id = socket.id;
  console.log(id);
  socket.on("info", ({ username }) => {
    console.log(username);
    users.push({ username, id });
    console.log(users);
  });
  socket.on("chatmessage", ({ from, text, to }) => {
    let receiver = users.find((user) => user.username === to);
    io.to(receiver.id).emit("message", { from, text, to });
    console.log(text);
    console.log(receiver);
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
app.use("/msgs", msgRoutes);

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
