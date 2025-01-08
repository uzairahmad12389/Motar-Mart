import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Favourite.css";

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
      {favoriteCars.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Model</th>
              <th>Price</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {favoriteCars.map((car, index) => (
              <tr key={index}>
                <td>{car.name}</td>
                <td>{car.model}</td>
                <td>{car.price}</td>
                <td>{car.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
