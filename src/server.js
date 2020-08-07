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
