import React, { useState } from 'react';
import formStyles from './Form.module.css';

const LoginForm: React.FC<{ onLogin: (email: string) => void; onSwitchToSignUp: () => void }> = ({ onLogin, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((user: { email: string; password: string }) => user.email === email && user.password === password);
        if (user) {
            onLogin(email);
        } else {
            alert('Invalid email or password');
        }
    };

    return (
        <div className={formStyles.form}>
            <h2>Sign in</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className={`${formStyles.buttonOrange}`}>Sign in</button>
            </form>
            <p>Don't have an account? <a href="#" onClick={onSwitchToSignUp}>Sign up</a></p>
        </div>
    );
};

export default LoginForm;
