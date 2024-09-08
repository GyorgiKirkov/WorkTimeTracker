import React, { useState } from 'react';
import formStyles from '../LoginForm/Form.module.css';

const SignUpForm: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully!');
        onSwitchToLogin();
    };

    return (
        <div className={formStyles.form}>
            <h2>Sign up</h2>
            <form onSubmit={handleSignUp}>
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
                <button type="submit">Sign up</button>
            </form>
            <p>Already have an account? <a href="#" onClick={onSwitchToLogin}>Sign in</a></p>
        </div>
    );
};

export default SignUpForm;
