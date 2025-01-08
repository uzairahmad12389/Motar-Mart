import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="dashboard">
      {/* Logout Button */}
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <h2>Dashboard</h2>
      <div className="button-container">
        
        <button className="btn"><Link to="/add-car">Add Car</Link></button>
        <button className="btn"><Link to="/carlisting">Car Listing</Link></button>
        <button className="btn"><Link to="/Compare">Compare Cars</Link></button>
        <button className="btn"><Link to="/search">Search</Link></button>
        <button className="btn"><Link to="/categories">Categories</Link></button>
        <button className="btn"><Link to="/favourite">Favourite Cars</Link></button>
        <button className="btn"><Link to="/rating">Car Ratings</Link></button>
        <button className="btn"><Link to="/add-dealership">Add Dealership</Link></button>
        <button className="btn"><Link to="/get-dealership">View Dealerships</Link></button>
      </div>
    </div>
  );
};

export default Dashboard;
