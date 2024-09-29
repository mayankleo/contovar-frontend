import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import peerInstance from '../services/peer';
import { VideoCameraIcon, MicrophoneIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import socketInstance from '../services/socket';

const VideoChat = ({ roomId, joining, remotePeerId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const dialogRef = useRef(null);
  const cameraOnRef = useRef(true);
  const micOnRef = useRef(true);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
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

      if (joining) {
        const call = peerInstance.call(remotePeerId, localVideoRef.current.srcObject);
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      }
    };

    initMedia();

    // Handle visibility change (tab change)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('You have changed the tab. If recording, it will be stopped.');
        if (isRecording) {
          stopRecording(); // Stop the recording if it's in progress
        }
      }
    };

    // Add the event listener to detect when the user changes tabs
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      const localVideo = localVideoRef.current;
      if (localVideo && localVideo.srcObject) {
        localVideo.srcObject.getTracks().forEach(track => track.stop());
      }

      // Clean up visibility event listener when the component unmounts
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [joining, remotePeerId, isRecording]);

  // Enter full screen mode
  const enterFullScreen = () => {
    const element = document.documentElement; // Full screen for the entire document
    if (element.requestFullscreen) {
      element.requestFullscreen();
      setIsFullScreen(true);
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
      setIsFullScreen(true);
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
      element.webkitRequestFullscreen();
      setIsFullScreen(true);
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
      setIsFullScreen(true);
    }
  };

  // Exit full screen handler
  const handleFullScreenChange = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(false);
      const result = window.confirm('You have exited full screen. Would you like to return to full screen?');
      if (result) {
        enterFullScreen();
      }
    } else {
      setIsFullScreen(true);
      alert('You are back in full screen.');
    }
  };

  // Start screen recording automatically (with full screen capture)
  const startRecording = async () => {
    try {
      enterFullScreen(); // Go full screen on start recording

      // Listen for full screen exit
      document.addEventListener('fullscreenchange', handleFullScreenChange);

      // Record the entire screen automatically without asking the user to choose
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" }, // Automatically capture the screen
        audio: true,
      });
      
      mediaRecorderRef.current = new MediaRecorder(screenStream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `recording-${roomId}.webm`, { type: 'video/webm' });

        // Send blob to server
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload', {  // Make sure to replace this with your API endpoint
            method: 'POST',
            body: formData,
          });
          if (response.ok) {
            alert('Recording saved to the server.');
          } else {
            alert('Failed to save recording to the server.');
          }
        } catch (error) {
          console.error('Error saving recording to server:', error);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Notify the other user that the recording has started
      socketInstance.emit('recording-started', { roomId });

    } catch (error) {
      console.error('Error starting screen recording:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Notify the other user that the recording has stopped
      socketInstance.emit('recording-stopped', { roomId });

      // Clean up listeners
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      cameraOnRef.current = videoTrack.enabled;
      document.getElementById('camera-icon').classList.toggle('text-red-500', !cameraOnRef.current);
    }
  };

  const toggleMic = () => {
    const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      micOnRef.current = audioTrack.enabled;
      document.getElementById('mic-icon').classList.toggle('text-red-500', !micOnRef.current);
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
          <button className='rounded-full p-2' onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
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

VideoChat.propTypes = {
  roomId: PropTypes.string.isRequired,
  joining: PropTypes.bool.isRequired,
  remotePeerId: PropTypes.string,
};

export default VideoChat;

