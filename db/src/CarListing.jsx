import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./CarListing.css";

const CarListing = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  const goBackToDashboard = () => {
    navigate("/dashboard"); // Navigate to the Dashboard route
  };

  useEffect(() => {
    fetch("http://localhost:4000/get-car")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCars(data);
        } else {
          console.error("Invalid response format:", data);
          setCars([]);
        }
      })
      .catch((error) => console.error("Error fetching car data:", error));
  }, []);

  return (
    <div className="car-listing">
      <h1>Car Listings</h1>
      <div className="car-grid">
        {cars.length > 0 ? (
          cars.map((car, index) => (
            <div className="car-card" key={car._id || index}>
              <h2>{car.name}</h2>
              <p><strong>Model:</strong> {car.model}</p>
              <p><strong>Price:</strong> ${car.price}</p>
              <p>{car.description}</p>
            </div>
          ))
        ) : (
          <p>No cars available or loading...</p>
        )}
      </div>
      <button className="back-button" onClick={goBackToDashboard}>
  Back to Dashboard
</button>
    </div>
  );
};

export default CarListing;
