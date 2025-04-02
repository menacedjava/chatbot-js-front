const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {};

io.on("connection", (socket) => {
    console.log("Yangi foydalanuvchi ulandi:", socket.id);

    socket.on("setUsername", (username) => {
        users[socket.id] = username;
        io.emit("userList", Object.values(users));
    });

    socket.on("message", (msg) => {
        io.emit("message", { user: users[socket.id], text: msg });
    });

    socket.on("disconnect", () => {
        console.log(`${users[socket.id]} chiqib ketdi.`);
        delete users[socket.id];
        io.emit("userList", Object.values(users));
    });
});

app.use(express.static("public"));

server.listen(3000, () => {
    console.log("?? Chat server 3000-portda ishlamoqda...");
});
