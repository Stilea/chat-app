const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Public papkani ulash
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Foydalanuvchi ismni saqlash
    socket.on('set username', (username) => {
        socket.username = username;
        console.log(`Username set for ${socket.id}: ${username}`);
    });

    // Xabar yuborilganda
    socket.on('chat message', (msg) => {
        const message = { username: socket.username || 'Anonymous', text: msg };
        io.emit('chat message', message);
    });

    // Foydalanuvchi uzilganda
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
