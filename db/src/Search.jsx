import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import img1 from "./Images/civic.jpeg"; // Default image if no car image is available
import "./Favourite.css"; // Ensure your CSS is updated to style the buttons

// Function to get car image based on the car name
const getCarImage = (carName) => {
  switch (carName.toLowerCase()) {
    case "city":
      return "./Images/City.jpeg"; // Replace with actual image path for city
    case "corolla":
      return "./Images/Corolla.jpeg"; // Replace with actual image path for corolla
    case "sportage":
      return "./Images/Sportage.jpeg"; // Replace with actual image path for sportage
    case "civic":
      return "./Images/Civic.jpeg"; // Replace with actual image path for civic
    default:
      return img1; // Default image if no match
  }
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  // Handle search
  const handleSearch = () => {
    setError(""); // Reset error before search
    axios
      .get(`http://localhost:4000/search?model=${searchQuery}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setSearchResults(response.data);
        } else {
          setSearchResults([]);
          setError("Unexpected response format from server.");
        }
      })
      .catch((err) => {
        console.error("Error searching cars:", err);
        setError("Failed to fetch search results. Please try again later.");
      });
  };

  return (
    <div className="search-container">
      <h1>Search Cars</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter car model..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="black-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="search-results">
        {error && <p className="error-message">{error}</p>}
        {searchResults.length > 0 ? (
          <div className="car-grid">
            {searchResults.map((car, index) => (
              <div className="car-card" key={car._id || index}>
                {/* Display car-specific image, fallback to default image */}
                <img
                  src={getCarImage(car.name)} // Get the image based on the car name
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
            ))}
          </div>
        ) : (
          !error && <p>No cars found.</p>
        )}
      </div>

      <button className="black-button back-button" onClick={() => navigate(-1)}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Search;
