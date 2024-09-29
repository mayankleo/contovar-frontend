import VideoChat from "../components/VideoChat";
import WhiteBoard from "../components/WhiteBoard";
import CodeIDLE from "../components/CodeIDLE";
import { useEffect, useState } from 'react';
import peerInstance from "../services/peer";
import socketInstance from '../services/socket';

const Interview = () => {
  const [state, setState] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [joining, setJoining] = useState(false);
  const [peerId, setPeerId] = useState(peerInstance.id);
  const [remotePeerId, setRemotePeerId] = useState('');

  useEffect(() => {
    peerInstance.on('open', (peerId) => {
      setPeerId(peerId);
    });
  })

  const createRoom = async () => {
    if (!roomId) {
      alert("Enter room code");
      return
    }
    await socketInstance.timeout(5000).emit('create-room', { roomId, peerId }, async (err, response) => {
      if (err) {
        console.log(err);
      } else {
        if (response.status) {
          setJoining(false);
          setState(true);
          console.log(response.message);
        } else {
          alert(response.message);
        }
      }
    });
  };

  const joinRoom = async () => {
    if (!roomId) {
      alert("Enter room code");
      return
    }
    await socketInstance.timeout(5000).emit('join-room', { roomId, peerId }, async (err, response) => {
      if (err) {
        console.log(err);
      } else {
        if (response.status) {
          setRemotePeerId(response.peerId);
          setJoining(true);
          setState(true);
        } else {
          alert(response.message);
        }
      }
    });
  };

  return (
    <>
      {!state ?
        <div className='flex justify-center items-center flex-col gap-8'>
          <h1 className="text-5xl text-primary">Join Interview</h1>
          <div className="w-1/2 flex flex-col gap-5">
            <input className="w-full" type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Enter room code" />
            <div className="flex gap-5">
              <button className="w-full" onClick={createRoom}>Create Room</button>
              <button className="w-full" onClick={joinRoom}>Join Room</button>
            </div>
          </div>
        </div>
        :
        <div className="grid grid-cols-[1fr_2fr]">
          <VideoChat roomId={roomId} joining={joining} remotePeerId={remotePeerId} />
          <div className="grid grid-rows-2">
            <WhiteBoard roomId={roomId} />
            <CodeIDLE roomId={roomId} />
          </div>
        </div>
      }
    </>
  )
}

export default Interview