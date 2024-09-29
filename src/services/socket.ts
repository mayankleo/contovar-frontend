import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socketInstance = io(SOCKET_URL);

export default socketInstance;
