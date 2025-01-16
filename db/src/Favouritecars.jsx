import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Favourite.css";
import img1 from "./Images/civic.jpeg"; // Fallback image

// Function to map car names to image paths
const getCarImage = (carName) => {
  switch (carName.toLowerCase()) {
    case "city":
      return "./Images/City.jpeg";
    case "corolla":
      return "./Images/Corolla.jpeg";
    case "sportage":
      return "./Images/Sportage.jpeg";
    case "civic":
      return "./Images/Civic.jpeg";
    default:
      return img1; // Default image if no match
  }
};

const FavoriteCars = () => {
  const [favoriteCars, setFavoriteCars] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchFavoriteCars = async () => {
      try {
        const response = await axios.get("http://localhost:4000/favor");
        setFavoriteCars(response.data);
      } catch (err) {
        console.error("Error fetching favorite cars:", err);
      }
    };

    fetchFavoriteCars();
  }, []);

  return (
    <div className="favorite-cars-container">
      <h2>Your Favorite Cars</h2>

      {/* Car Listings */}
      {favoriteCars.length > 0 ? (
        <div className="car-grid">
          {favoriteCars.map((car, index) => {
            const carImage = getCarImage(car.name); // Get the image for the car
            return (
              <div className="car-card" key={index}>
                {/* Display car-specific image */}
                <img
                  src={carImage}
                  alt={car.name}
                  className="car-image"
                  onError={(e) => e.target.src = img1} // Fallback to default image if not found
                />
                <h3>{car.name}</h3>
                <p><strong>Model:</strong> {car.model}</p>
                <p><strong>Price:</strong> ${car.price}</p>
                <p>{car.description}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No favorite cars found.</p>
      )}

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default FavoriteCars;
