import { useState } from 'react';
import './Auth.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // Signup successful message from backend
            } else {
                setError('Signup failed, please try again!');
                console.error('Signup failed');
            }
        } catch (error) {
            setError('Error during signup, please try again!');
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                <button type="submit">Sign Up</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                Already have an account?{' '}
                <span onClick={() => (window.location.href = '/login')}>Login</span>
            </p>
        </div>
    );
};

export default SignUp;
