import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ReactElement } from 'react';

interface MiddlewareProps {
    children: ReactElement;
}

const Middleware = ({ children }: MiddlewareProps) => {
    const location = useLocation();
    const isAuthenticated = () => {
        if (Cookies.get('access_token')) {
            return true;
        }
        return false
    }
    return isAuthenticated() ? <>{children}</> : <Navigate to={`/auth?RedirectTo=${location.pathname}`} />;
};

export default Middleware;