import Peer from 'peerjs';

const peerInstance = new Peer({
    host: import.meta.env.VITE_PEER_HOST,
    port: Number(import.meta.env.VITE_PEER_PORT),
    path: '/',
    secure: true
});

peerInstance.on('open', (peerId) => {
    console.log('peerId: ', peerId);
});

export default peerInstance;

