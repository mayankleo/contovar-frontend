import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Cookies from 'js-cookie';
import socketInstance from '../services/socket';
import { useEffect, useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const NavBar = () => {
    const location = useLocation();
    const [connection, setConnection] = useState(false);
    const [connectionError, setConnectionError] = useState(false);

    const paths = {
        home: '/',
        interview: '/interview',
        about: '/about',
        dashboard: '/dashboard',
        auth: '/auth',
        promptgen: '/promptgen',
        mock: '/mock',
    };

    const getButtonClasses = (path: string) => {
        return location.pathname === path;
    };

    const isAuthenticated = () => {
        if (Cookies.get('access_token')) {
            return true;
        }
        return false
    }

    useEffect(() => {
        socketInstance.on('connect', () => {
            setConnection(true);
        });
        socketInstance.on('connect_error', () => {
            setConnectionError(true);
        });
    }, []);

    return (
        <nav className="flex justify-between items-center w-full px-4 py-2">
            <div className='flex items-center gap-4'>
                <img src={Logo} alt="logo" className="h-12" />
                {!connection && !connectionError && <ExclamationCircleIcon className='text-primary animate-pulse size-6' title='Connecting to server...' />}
                {connectionError && <ExclamationCircleIcon className='text-red-600 size-6' title='Failed to connect with server' />}
            </div>
            <div className="flex gap-6 justify-center items-center">
                <Link to={paths.home}>
                    <button className={`bg-white text-primary border-2 border-primary ${getButtonClasses(paths.home) ? '!bg-primary text-white border-0' : ''}`}>Home</button>
                </Link>
                <Link to={paths.interview}>
                    <button className={`bg-white text-primary border-2 border-primary ${getButtonClasses(paths.interview) ? '!bg-primary text-white border-0' : ''}`}>Interview</button>
                </Link>
                <Link to={paths.promptgen}>
                    <button className={`bg-white text-primary border-2 border-primary ${getButtonClasses(paths.promptgen) ? '!bg-primary text-white border-0' : ''}`}>Prepare Interview</button>
                </Link>
                <Link to={paths.mock}>
                    <button className={`bg-white text-primary border-2 border-primary ${getButtonClasses(paths.mock) ? '!bg-primary text-white border-0' : ''}`}>Mock Interview</button>
                </Link>
                <Link to={paths.about}>
                    <button className={`bg-white text-primary border-2 border-primary ${getButtonClasses(paths.about) ? '!bg-primary text-white border-0' : ''}`}>About</button>
                </Link>
                {isAuthenticated() ?
                    <Link to={paths.dashboard}>
                        <button className={`bg-white text-primary border-2 border-primary ${getButtonClasses(paths.dashboard) ? '!bg-primary text-white border-0' : ''}`}>Dashboard</button>
                    </Link>
                    :
                    <Link to={paths.auth}>
                        <button className={`bg-white text-primary border-2 border-primary ${getButtonClasses(paths.auth) ? '!bg-primary text-white border-0' : ''}`}>Sign Up/In</button>
                    </Link>
                }
            </div>
        </nav>
    );
};

export default NavBar;
