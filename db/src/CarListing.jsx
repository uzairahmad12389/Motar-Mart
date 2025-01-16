import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "./Images/civic.jpeg"; // Import the default car image
import "./CarListing.css";

const CarListing = () => {
  const [cars, setCars] = useState([]); // State to store car data
  const navigate = useNavigate(); // Initialize the navigate function

  const goBackToDashboard = () => {
    navigate("/dashboard"); // Navigate back to the Dashboard
  };

  const getCarImage = (carName) => {
    
    switch (carName.toLowerCase()) {
      case "city":
        return "./Images/City.jpeg"; // Replace with actual image path for city
      case "corolla":
        return "./Images/Corolla.jpeg"; // Replace with actual image path for corolla
      case "sportage":
        return "./Images/Sportage.jpeg"; // Replace with actual image path for sportage
      case "Civic":
        return  "./Images/Civic.jpeg"; // Replace with actual image path for land cruiser
      default:
        return img1; // Default image if no match
    }
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
          setCars(data); // Set car data if valid
        } else {
          console.error("Invalid response format:", data);
          setCars([]); // Fallback if data is invalid
        }
      })
      .catch((error) => console.error("Error fetching car data:", error));
  }, []); // Empty dependency array to fetch once on mount

  return (
    <div className="car-listing">
      <h1>Car Listings</h1>
      <div className="car-grid">
        {cars.length > 0 ? (
          cars.map((car, index) => {
            // Use the getCarImage function to dynamically select the image
            const carImage = getCarImage(car.name);

            return (
              <div className="car-card" key={car._id || index}>
                {/* Display car-specific image, fallback to default image */}
                <img
                  src={carImage} // Dynamic image URL
                  alt={car.name}
                  className="car-image"
                  onError={(e) => {
                    
                    e.target.src = img1; // Fallback to default image if the car-specific image is not found
                  }}
                />
                <h2>{car.name}</h2>
                <p>
                  <strong>Model:</strong> {car.model}
                </p>
                <p>
                  <strong>Price:</strong> ${car.price}
                </p>
                <p>{car.description}</p>
              </div>
            );
          })
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
