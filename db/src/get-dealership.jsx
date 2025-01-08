import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Favourite.css';

const Dealerships = () => {
  const [dealerships, setDealerships] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Fetch dealerships data
  useEffect(() => {
    const fetchDealerships = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/getdealerships');
        setDealerships(response.data);
      } catch (err) {
        console.error("Error fetching dealerships:", err);
        setError("Unable to fetch dealerships. Please try again later.");
      }
    };

    fetchDealerships();
  }, []);

  return (
    <div className="dealerships-container">
      <h2>Car Dealerships</h2>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Dealership Name</th>
            <th>Location</th>
            <th>Car Name</th>
            <th>Car Model</th>
            <th>Car Price</th>
          </tr>
        </thead>
        <tbody>
          {dealerships.map((dealership) => (
            <tr key={dealership.dealership_id}>
              <td>{dealership.dealership_name}</td>
              <td>{dealership.location}</td>
              <td>{dealership.car_name}</td>
              <td>{dealership.model}</td>
              <td>${dealership.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Dealerships;
