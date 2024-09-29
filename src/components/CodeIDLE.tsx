import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import * as Babel from '@babel/standalone';
import { loadPyodide } from 'pyodide';
import socketInstance from '../services/socket';

interface CodeIDLEProps {
    roomId: string;
}

const CodeIDLE = ({ roomId }: CodeIDLEProps) => {
    const [code, setCode] = useState('//Write code here');
    const [output, setOutput] = useState('Output show here!');
    const [pyodide, setPyodide] = useState(null);
    const [language, setLanguage] = useState('javascript');

    useEffect(() => {
        const initPyodide = async () => {
            const pyodideInstance = await loadPyodide({
                indexURL:"/node_modules/pyodide/"
            });
            setPyodide(pyodideInstance);
        };
        initPyodide();

        socketInstance.on('codesync', async ({ code, output }) => {
            setCode(code);
            setOutput(output)
        });

    }, []);

    const runCode = async () => {
        if (language == "javascript") {
            let finalResult: string;
            try {
                const transformedCode = Babel.transform(code, { presets: ['es2015'] }).code;
                const originalLog = console.log;
                const outputArray:string[] = [];
                console.log = (...args) => outputArray.push(args.join(' '));
                const result = eval(transformedCode);
                console.log = originalLog;
                const langOutput = outputArray.join('\n');
                finalResult = result != "use strict" ? langOutput : 'Code executed successfully, no output.';
            } catch (error) {
                finalResult = error.toString();
            }
            setOutput(finalResult);
            socketInstance.emit('codesync', { code: code, output: finalResult, roomId });
        } else {
            let finalResult: string;
            try {
                const originalLog = console.log;
                const outputArray: string[] = [];
                console.log = (...args) => outputArray.push(args.join(' '));
                // const result = await pyodide.runPython(code);
                await pyodide.runPython(code);
                console.log = originalLog;
                const langOutput = outputArray.join('\n');
                finalResult = langOutput || "Code executed successfully, no output.";
            } catch (error) {
                finalResult = String(error.message);
            }
            setOutput(finalResult);
            socketInstance.emit('codesync', { code: code, output: finalResult, roomId });
        }
    }

    return (
        <div className="grid grid-rows-[auto_1fr] gap-4">
            <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center justify-between">
                    <div className='p-2 flex items-center gap-4'>
                        <label htmlFor="language" className="">Select Language </label>
                        <select id="language" value={language} onChange={(e) => { setLanguage(e.target.value) }} className="px-4 py-2 border-2 border-primary text-primary rounded-md font-semibold">
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                        </select>
                    </div>
                    <button onClick={runCode}>Run</button>
                </div>
                <h3 className="text-2xl text-primary">Output</h3>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <CodeMirror
                    value={code}
                    className='w-full h-full border'
                    extensions={[language == "python" ? python() : javascript()]}
                    onChange={(value) => {
                        setCode(value);
                        socketInstance.emit('codesync', { code: value, output: output, roomId });
                    }}
                />
                <p className="w-full h-full border-2 p-2">{output}</p>
            </div>
        </div>
    );
};

export default CodeIDLE;
