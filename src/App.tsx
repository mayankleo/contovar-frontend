import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Middleware from './Middleware';
import About from './pages/About';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Mock from './pages/Mock';
import PromptGen from './pages/PromptGen';
import NavBar from './components/Navbar';
import Cookies from 'js-cookie';
import { useState } from 'react';

const App = () => {
    const [seeweb, setSeeweb] = useState(false);
    return (
        <Router>
            <div className={`${seeweb ? 'grid' : 'hidden'} xl:grid h-screen grid-rows-[auto_1fr]`}>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/interview" element={<Interview />} />
                    <Route path="/promptgen" element={<PromptGen />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/mock" element={<Mock />} />
                    <Route path="/auth" element={Cookies.get('access_token') ? <Navigate to="/dashboard" /> : <Auth />} />
                    <Route path="/dashboard" element={<Middleware><Dashboard /></Middleware>} />
                    <Route path="/promptgen" element={<PromptGen />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <div className={`${seeweb ? 'hidden' : 'flex'} xl:hidden flex h-screen items-center justify-center text-center flex-col gap-8`}>
                <h1 className='text-red-600 text-2xl'>Sorry, Our website is not made for small screens.</h1>
                <div>
                    <button onClick={() => setSeeweb(true)}>View Anyway</button>
                    <p className='text-primary text-xs pt-1'>*Disclamer: some feture may not work</p>
                </div>
            </div>
        </Router>
    );
};

export default App;
