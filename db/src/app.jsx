import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import img1 from './Images/car.jpeg';
import Login from './login';
import SignUp from './signup';
import Dashboard from './Dashboard'; // Assuming you have a Dashboard component
import './Auth.css'; // Import CSS file for styling
import CarComparison from './Compare';
import AddCar from './AddCar';
import CarListing from './CarListing';
import Search from './Search';
import FavoriteCars from './Favouritecars';
import Dealerships from './get-dealership';
import AddDealership from './Add-dealer';
import CarList from './Categories';
import CarRating from './Rate';
const App = () => {                   
    return (
        <Router>
            <div className="app">
           
            <img src={img1} alt="Car" className="header-image" />
                <h1>Welcome to Our App</h1>
                <Routes>
                    {/* Define routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/Compare" element={<CarComparison />} />
                    <Route path="/add-car" element={<AddCar />} />
                    <Route path="/carlisting" element={<CarListing />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/carlisting" element={<CarListing />} />
                    <Route path="/categories" element={<CarList />} />
                    <Route path="/favourite" element={<FavoriteCars />} />
                    <Route path="/rating" element={<CarRating />} />
                    <Route path="/get-dealership" element={<Dealerships />} />
                    <Route path="/add-dealership" element={<AddDealership />} />
                    {/* Home page route */}
                    <Route
                        path="/"
                        element={
                            <>
                                
                                <div className="button-container">
                                    <button className="btn"><Link to="/login">Login</Link></button>
                                    <button className="btn"><Link to="/signup">Sign Up</Link></button>
                                   
                                </div>
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
