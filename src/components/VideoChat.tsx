import { useEffect, useRef } from 'react';
import peerInstance from '../services/peer';
import { VideoCameraIcon, MicrophoneIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
interface VideoChatProps {
  roomId: string;
  joining: boolean;
  remotePeerId?: string;
}

const VideoChat = ({ roomId, joining, remotePeerId }: VideoChatProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        localVideoRef.current.srcObject = stream;
      } catch (error) {
        alert('Error accessing Camera/Microphone devices');
        console.error('Error accessing media devices.', error);
      }

      peerInstance.on('call', (call) => {
        call.answer(localVideoRef.current.srcObject);
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });

      if (joining && remotePeerId) {
        const call = peerInstance.call(remotePeerId, localVideoRef.current.srcObject);
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      }
    };

    initMedia();

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [joining, remotePeerId]);

  const toggleCamera = () => {
    const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      document.getElementById('camera-icon').classList.toggle('text-red-500', !videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
    if (audioTrack) {
      console.log('audioTrack.enabled :>> ', audioTrack.enabled);
      audioTrack.enabled = !audioTrack.enabled;
      document.getElementById('mic-icon').classList.toggle('text-red-500', !audioTrack.enabled);
    }
  };

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <div className='grid grid-rows-2 relative'>
      <video className='h-full aspect-video object-cover' ref={remoteVideoRef} autoPlay></video>
      <video className='h-full aspect-video object-cover' ref={localVideoRef} autoPlay muted></video>
      <div className='absolute bottom-0 w-full flex justify-center mb-2'>
        <div className='flex gap-4'>
          <button className='rounded-full p-2' onClick={toggleCamera}>
            <VideoCameraIcon id="camera-icon" className='size-6' />
          </button>
          <button className='rounded-full p-2' onClick={toggleMic}>
            <MicrophoneIcon id="mic-icon" className='size-6' />
          </button>
          <button onClick={openDialog} className='rounded-full p-2'>
            <InformationCircleIcon className='size-6' />
          </button>
        </div>
      </div>
      <dialog ref={dialogRef} className='rounded-md p-6 text-right'>
        <div className='text-start mb-6'>
          <table>
            <tbody>
              <tr>
                <th className='text-start'>Call ID</th>
                <td>: {peerInstance.id}</td>
              </tr>
              <tr>
                <th className='text-start'>Room ID</th>
                <td>: {roomId}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button onClick={closeDialog}>Close</button>
      </dialog>
    </div>
  );
};

export default VideoChat;

