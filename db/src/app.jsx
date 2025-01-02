import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import SignUp from './signup';

const App = () => {
    return (
        <Router>
            <div className="app">
                <h1>Welcome to Our App</h1>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/"
                        element={
                            <>
                                <h2>Please select a page to continue:</h2>
                                <ul>
                                    <li><a href="/login">Login</a></li>
                                    <li><a href="/signup">Sign Up</a></li>
                                </ul>
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
