const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
// const io = new Server(server);


const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000","http://192.168.88.179:3000"], // Assuming your Next.js app runs on port 3000
      methods: ["GET", "POST"]
    }
  });
  

app.use(cors());


app.get('/', (req, res) => {
  res.send('Socket.io server running');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('input-change', (data) => {
    // Broadcast the changes to all other clients except the sender
    // socket.broadcast.emit('input-change', data);
    io.emit('input-change', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
