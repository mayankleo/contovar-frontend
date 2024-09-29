import Peer from 'peerjs';

const peerInstance = new Peer({
    // host: '192.168.67.0',
    host: 'localhost',
    port: 5001,
    path: '/',
});

peerInstance.on('open', (peerId) => {
    console.log('peerId: ', peerId);
});

export default peerInstance;

