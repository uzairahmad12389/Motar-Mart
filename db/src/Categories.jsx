import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./Categories.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [category_type, setCategoryType] = useState('SUV'); // Default to SUV
  const [category] = useState(["SUV", "sedan", "hatchback", "coupe", "convertible"]);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/categories?categoryType=${category_type}`);
        setCars(response.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };

    fetchCars();
  }, [category_type]);

  // Navigate back to the dashboard
  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="car-list">
      <h1>Car List</h1>
      
      {/* Category Filter */}
      <div className="category-filter">
        <label>Select Car Category: </label>
        <select 
          value={category_type} 
          onChange={(e) => setCategoryType(e.target.value)}
        >
          {category.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Display Car List */}
      <div className="car-table-container">
        {cars.length > 0 ? (
          <table className="car-table">
            <thead>
              <tr>
                <th>Car Name</th>
                <th>Model</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={index}>
                  <td>{car.name}</td>
                  <td>{car.model}</td>
                  <td>${car.price}</td>
                  <td>{car.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-cars">No cars available in this category.</p>
        )}
      </div>

      {/* Back to Dashboard Button */}
      <button className="back-button" onClick={goBackToDashboard}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default CarList;
