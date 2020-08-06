const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const http = require("http");
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
  });
});

let port = process.env.port;
server.use(cors());

server.listen(port, () => {
  console.log("RUNNING ON PORT " + port);
});
