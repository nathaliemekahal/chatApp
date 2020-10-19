const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const http = require("http");
const userRoutes = require("./users/index.js");
const msgRoutes = require("./msgs/index");
let rooms = require("./rooms/data.json");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);
let users = [];
io.on("connection", (socket) => {
  let id = socket.id;
  let user;
  socket.on("info", ({ username }) => {
    const userExists = users.find((user) => user.username === username);
    if (!userExists) {
      users.push({ username, id });
    }
    user = username;
    console.log(users);
    io.emit("refreshUsers",{users})
  });
  socket.on("chatmessage", ({ from, text, to, time }) => {
    let receiver = users.find((user) => user.username === to);
    let sender = users.find((user) => user.username === from);
    if (receiver) {
      io.to(receiver.id).emit("message", { from, text, to, time });
    }
    io.to(sender.id).emit("message", { from, text, to, time });

    console.log(receiver);
    console.log(sender);
  });
  //

  //
  socket.on("disconnect", () => {
    let newUsers = users.filter((element) => element.username !== user);
    users = newUsers;
    // io.emit("userAfterDC", newUsers);
    console.log("disconnected", newUsers);
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
