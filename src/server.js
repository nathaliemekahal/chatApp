const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const http = require("http");
const users = require("./users.json");
const userRoutes = require("./users/index.js");
const msgRoutes = require("./msgs/index");

const axios = require("axios");
let rooms = require("./rooms/data.json");
const { response } = require("express");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let userList = [];

io.on("connection", (socket) => {
  let Sid = socket.id;
  console.log("SOCKET ID", Sid);

  socket.on("info", ({ username, name }) => {
    let userExists = true;
    axios
      .get("http://localhost:3007/users")
      .then(response)
      .then((data) => {
        filteredArray = data.data.filter((user) => user.username === username);
        userExists = filteredArray.length > 0 ? true : false;
        console.log(userExists);
      })
      .catch((error) => console.log(error));
    console.log("Here");
    // if (!userExists) {
    //   user = { username: username, name: name };
    //   axios
    //     .post("http://localhost:3007/users", { ...user, Sid: Sid })
    //     .then((res) => {
    //       // for (let key in data) {
    //       //   const user = data[key];
    //       //   user.id = key;
    //       //   users.push(user);
    //       // }
    //       // this.users = users;
    //     })
    //     .catch((error) => console.log(error));
    // }
  });

  // socket.on(
  //   "chatmessage",
  //   ({ from: { name, username, Sid }, text, to: { name, username, Sid } }) => {
  //     let receiver = users.find((user) => user.username === to);
  //     io.to(receiver.id).emit("message", { from, text, to });
  //     console.log(text);
  //     console.log(receiver);
  //   }
  // );

  // socket.on("disconnect", () => {
  //   console.log("disconnected");
  // });
});

let port = process.env.port;
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/msgs", msgRoutes);

mongoose.connect(process.env.mongo_url).then(
  server.listen(port, () => {
    console.log(`working on port ${port}`);
  })
);
