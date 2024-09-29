import { useState, useEffect } from 'react';
import socketInstance from '../services/socket';

const PromptGen = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: ''
  });
  const [generatedText, setGeneratedText] = useState(null);

  const handleClear = () => {
    setFormData({
      jobTitle: '',
      jobDescription: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    socketInstance.on('gemini', ({ response }) => {
      setGeneratedText(response);
    });
  }, []);

  const handleGenerate = async () => {
    try {
      socketInstance.emit('gemini', formData);
    } catch (error) {
      console.error('Failed to post data:', error);
    }
  };

  return (
    <div className="container mx-auto flex items-center gap-6 py-20 h-[90vh]">
      <div className="w-full flex flex-col gap-6 bg-white p-6 rounded-md shadow-lg h-full">
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">Job Title</h2>
          <input
            type="text"
            name='jobTitle'
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full p-2 border-2 border-primary"
            placeholder="Enter job title here"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">Job Description</h2>
          <textarea
            value={formData.jobDescription}
            onChange={handleChange}
            name='jobDescription'
            rows="8"
            className="w-full border-2 p-2 rounded-md border-primary"
            placeholder="Enter job description here"
          ></textarea>
        </div>

        <div className="flex gap-6">
          <button
            onClick={handleClear}
            className="bg-white text-primary border-2 border-primary">
            Clear
          </button>
          <button
            onClick={handleGenerate}
            className="bg-primary text-white border-2 border-primary">
            Generate
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6 bg-white p-6 rounded-md shadow-lg h-full overflow-y-scroll">
        <h2 className="text-2xl font-semibold text-primary mb-3">Response</h2>
        <div className="border p-4 rounded bg-gray-100">
          {generatedText ? (
            <pre className="whitespace-pre-wrap text-primary">{generatedText}</pre>
          ) : (
            <p className="text-primary">No data generated yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptGen;
