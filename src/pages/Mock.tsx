import { useEffect, useState } from "react";
import socketInstance from "../services/socket";
import peerInstance from '../services/peer';

const Auth = () => {
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState([]);

  useEffect(() => {
    socketInstance.emit('mock', { id: peerInstance.id });
    socketInstance.on('mock', ({ response }) => {
      setOutput(response);
    });
  }, []);

  const textToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      console.log('Speech recognition ended');
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition: ' + event.error);
    };
  }


  const handleQuery = async (e) => {
    e.preventDefault();
    socketInstance.emit('mock', { id: peerInstance.id, q: query });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-1/2 shadow-md flex flex-col p-5 rounded-md gap-8 text-center">
        <h1 className="text-5xl text-primary">Mock Interview</h1>
        <hr className="border-2 border-primary" />
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <button className="w-full" onClick={() => textToSpeech(output)}>Listen Interviewer</button>
            <button className="w-full" onClick={startRecognition}>Record Answer</button>
          </div>
          <div>
            {output}
          </div>
          <form onSubmit={handleQuery} className="flex flex-col gap-4">
            <textarea rows={8} className="w-full border-2 p-2 rounded-md border-primary" name="query" value={query} onChange={(e) => setQuery(e.target.value)}></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
