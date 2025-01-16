import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Categories.css";

// Define the fallback image path
import img1 from "./Images/civic.jpeg"; // Ensure you have a default image

// Function to get the car image based on the car name
const getCarImage = (carName) => {
  switch (carName.toLowerCase()) {
    case "city":
      return "./Images/City.jpeg"; // Replace with actual image path for City
    case "corolla":
      return "./Images/Corolla.jpeg"; // Replace with actual image path for Corolla
    case "sportage":
      return "./Images/Sportage.jpeg"; // Replace with actual image path for Sportage
    case "civic":
      return "./Images/Civic.jpeg"; // Replace with actual image path for Civic
    default:
      return img1; // Default image if no match
  }
};

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [category_type, setCategoryType] = useState("SUV"); // Default to SUV
  const [category] = useState(["SUV", "sedan", "hatchback", "coupe", "convertible"]);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/categories?categoryType=${category_type}`
        );
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
    <div className="car-listing">
      <h1>Car Listings</h1>
      <div className="category-filter">
        <label>Select Car Category: </label>
        <select value={category_type} onChange={(e) => setCategoryType(e.target.value)}>
          {category.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

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
          <p>No cars available in this category.</p>
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
