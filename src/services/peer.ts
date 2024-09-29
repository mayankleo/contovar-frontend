import Peer from 'peerjs';

const peerInstance = new Peer();

peerInstance.on('open', (peerId) => {
    console.log('peerId: ', peerId);
});

export default peerInstance;

