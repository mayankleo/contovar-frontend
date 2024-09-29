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

const App = () => {
    return (
        <Router>
            <div className='h-screen grid grid-rows-[auto_1fr]'>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/interview" element={<Interview />} />
                    <Route path="/promptgen" element={<PromptGen/>}/>
                    <Route path="/about" element={<About />} />
                    <Route path="/mock" element={<Mock />} />
                    <Route path="/auth" element={Cookies.get('access_token') ? <Navigate to="/dashboard" /> : <Auth />} />
                    <Route path="/dashboard" element={<Middleware><Dashboard /></Middleware>} />
                    <Route path="/promptgen" element={<PromptGen />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
