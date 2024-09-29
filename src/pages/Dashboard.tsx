import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import ReactMarkdown from 'react-markdown';
import socketInstance from '../services/socket';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [question, setQuestion] = useState(false);
  const [title, setTitle] = useState("Generated Query");

  useEffect(() => {
    socketInstance.on('geminiResume', ({ response }) => {
      setGeneratedText(response);
    });
  }, []);

  const handleImageUpload = (imageFile) => {
    return Tesseract.recognize(imageFile, 'eng').then(({ data: { text } }) => {
      setExtractedText(text);
      socketInstance.emit('geminiResume', { resumeDescription: text, questions: question });
    });
  };

  const navigate = useNavigate();
  const logout = () => {
    Cookies.remove("access_token");
    navigate("/auth");
  }
  const handlePdfUpload = async () => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();

      reader.onload = async (event) => {
        const pdfData = new Uint8Array(event.target.result);
        const pdfDoc = await PDFDocument.load(pdfData);
        const numPages = pdfDoc.getPageCount();
        const pages = [];

        for (let i = 0; i < numPages; i++) {
          const page = pdfDoc.getPage(i);
          const { width, height } = page.getSize();
          const img = await page.renderToImage({
            width,
            height,
            format: 'jpeg'
          });
          pages.push(img);
        }

        const allTextPromises = pages.map((img) => handleImageUpload(img));
        await Promise.all(allTextPromises);
      };

      reader.readAsArrayBuffer(file);
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  return (
    <div className="container mx-auto p-6">
      <button onClick={logout} className='mb-4'>Logout</button>
      <div className="flex flex-col space-y-6">
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Upload Your Resume Image</h2>
          <input
            type="file"
            accept="image/*, application/pdf"
            onChange={handleFileChange}
            className="w-full p-2 mb-4 border-2 border-primary rounded focus:outline-none focus:ring focus:border-primary"
          />

          <div className="mt-4 space-x-4">
            <button
              onClick={() => {
                if (file.type === 'application/pdf') {
                  handlePdfUpload();
                } else {
                  setTitle("Generated Summary")
                  handleImageUpload(file);

                }
              }}
              className={`py-2 px-4 rounded hover:bg-primary-dark ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Summary'}
            </button>
            <button
              onClick={() => { setQuestion(true); setTitle("Generated Question"); handleImageUpload(file); }}
              className="py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>
        </div>
        <div className="generated-text-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">{title}</h2>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            {generatedText ? (
              <ReactMarkdown className="react-markdown-test" children={generatedText} />
            ) : (
              <p className="text-primary">No data generated yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
