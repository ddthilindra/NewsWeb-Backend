const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const connectDB = require("./config/db.config");
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", routes);

const PORT = process.env.PORT || 5000;

async function server() {
  const http = require("http").createServer(app);
  const io = new Server(http, { transports: ["websocket"] });
  const roomName = "dogfoot";
  io.on("connection", (socket) => {
    socket.on("join", () => {
      socket.join(roomName);
      socket.to(roomName).emit("joined");
    });
    socket.on("offer", (offer) => {
      socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer) => {
      socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice) => {
      socket.to(roomName).emit("ice", ice);
    });
  });
  http.listen(PORT, () =>
    console.log(`Server is up and running on PORT ${PORT}`)
  );
}

server();
