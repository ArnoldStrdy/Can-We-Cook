import React, { useState } from 'react';
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const auth = firebase.auth();
    const persistance = firebase.auth.Auth.Persistence.SESSION;
    console.log("Auth: ", auth.currentUser);
    const handleLogin = async () => {
        try {
            await auth.setPersistence(persistance);
            await auth.signInWithEmailAndPassword(email, password);
            console.log("User logged in successfully");
            console.log(auth.currentUser);
            console.log("Is email persistent: ", auth.currentUser?.email === email);
        } catch (error) {
            setError((error as any).message);
            console.error("Error logging in: ", error);
        }
    };

    const handleSignup = async () => {
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            console.log("User signed up successfully");
        } catch (error) {
            setError((error as any).message);
            console.error("Error signing up: ", error);
        }
    };

    return (
        <div className="bg-white dark:bg-black flex flex-col items-center justify-center mt-20">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={isLogin ? handleLogin : handleSignup}>
                {isLogin ? 'Login' : 'Sign Up'}
            </button>
            {error && <p>{error}</p>}
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
            </button>
        </div>
    );
};

export default LoginPage;
