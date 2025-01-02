import { useState } from 'react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message); // Show success message
                window.location.href = '/dashboard'; // Redirect to dashboard
            } else {
                setError(data.error); // Show error message
            }
        } catch  {
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Welcome Back</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
            <p>
                Dont have an account?{' '}
                <span onClick={() => (window.location.href = '/signup')}>Sign Up</span>
            </p>
        </div>
    );
};

export default Login;
