const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store active rooms and their users
const rooms = {};

// Generate a random room code
function generateRoomCode() {
    return crypto.randomBytes(4).toString('hex');
}

// Handle room logic
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected.');

    // Handle hosting a room
    socket.on('host room', () => {
        const roomCode = generateRoomCode();
        rooms[roomCode] = [];
        socket.join(roomCode);
        socket.emit('room created', roomCode);
        console.log(`Room created: ${roomCode}`);
    });

    // Handle joining a room
    socket.on('join room', (roomCode) => {
        if (rooms[roomCode]) {
            socket.join(roomCode);
            socket.emit('room joined', roomCode);
            console.log(`User joined room: ${roomCode}`);
        } else {
            socket.emit('room error', 'Room does not exist.');
        }
    });

    // Handle chat messages
    socket.on('chat message', (roomCode, msg) => {
        console.log(`Message in room ${roomCode}: ${msg}`);
        io.to(roomCode).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
