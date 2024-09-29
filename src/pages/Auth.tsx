import { useState } from "react";
import socketInstance from "../services/socket";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
    const [signIn, setSignIn] = useState(true);
    const [formData, setFormData] = useState({
        username: 'admin',
        password: 'admin',
        email: 'admin@admin.admin'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        await socketInstance.timeout(5000).emit('login', formData, (err: never, response: { status: boolean, message: string, token: string }) => {
            if (err) {
                console.log(err);
            } else {
                if (response.status) {
                    Cookies.set('access_token', response.token);
                    navigate('/dashboard');
                } else {
                    alert(response.message);
                }
            }
        });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        await socketInstance.timeout(5000).emit('register', formData, (err: never, response: { status: boolean, message: string, token: string }) => {
            if (err) {
                console.log(err);
            } else {
                if (response.status) {
                    Cookies.set('access_token', response.token);
                    navigate('/dashboard');
                } else {
                    alert(response.message);
                }
            }
        });
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-1/2 shadow-md flex flex-col p-5 rounded-md gap-8 text-center">
                <h1 className="text-5xl text-primary">Sign Up/In</h1>
                <div className="flex gap-5">
                    <button className={`w-full bg-white text-primary border-2 border-primary ${signIn ? '!bg-primary text-white border-0' : ''}`} onClick={() => setSignIn(true)}>Sign In</button>
                    <button className={`w-full bg-white text-primary border-2 border-primary ${!signIn ? '!bg-primary text-white border-0' : ''}`} onClick={() => setSignIn(false)}>Sign Up</button>
                </div>
                <hr className="border-2 border-primary" />
                {signIn ? (
                    <div>
                        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
