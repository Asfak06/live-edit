
import { io } from 'socket.io-client';

// const socket = io('http://localhost:3001'); // Assuming your server will run on port 3001
const socket = io('http://192.168.88.179:3001'); // Assuming your server will run on port 3001

export default socket;
