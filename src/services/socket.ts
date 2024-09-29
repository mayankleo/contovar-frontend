import { io } from 'socket.io-client';

// const SOCKET_URL = 'https://192.168.67.0:5000';
const SOCKET_URL = 'https://localhost:5000';

const socketInstance = io(SOCKET_URL);

export default socketInstance;
