import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "./Favourite.css"; // Ensure your CSS is updated to style the buttons

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
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Model</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((car, index) => (
                <tr key={car._id || index}>
                  <td>{car.name}</td>
                  <td>{car.model}</td>
                  <td>${car.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
