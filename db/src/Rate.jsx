import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Rate.css";
import axios from "axios";

const CarRating = () => {
  const [carId, setCarId] = useState(""); // State to store carId
  const [newRating, setNewRating] = useState(0); // State to store new rating
  const [comment, setComment] = useState(""); // State to store comment
  const [averageRating, setAverageRating] = useState(0); // State to store average rating
  const navigate = useNavigate(); // Initialize navigate

  // Fetch average rating based on carId
  useEffect(() => {
    if (carId) {
      const fetchAverageRating = async () => {
        try {
          const avgResponse = await axios.get(`http://localhost:4000/api/cars/${carId}/average-rating`);
          setAverageRating(avgResponse.data.averageRating);
        } catch (err) {
          console.error("Error fetching average rating:", err);
        }
      };

      fetchAverageRating();
    }
  }, [carId]); // Fetch data whenever carId changes

  // Submit a new rating
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit the new rating and comment, but don't need to use response
      await axios.post(`http://localhost:4000/api/cars/${carId}/rate`, {
        rating: newRating,
        comment,
      });

      // Re-fetch the average rating after submitting a new rating
      const avgResponse = await axios.get(`http://localhost:4000/api/cars/${carId}/average-rating`);
      setAverageRating(avgResponse.data.averageRating);

      // Reset form fields
      setNewRating(0);
      setComment("");
    } catch (err) {
      console.error("Error adding rating:", err.response?.data || err);
    }
  };

  return (
    <div className="car-rating-container">
      <h3>Car Ratings</h3>

      {/* Input for carId */}
      <label>
        Car ID:
        <input
          type="text"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
          placeholder="Enter Car ID"
        />
      </label>

      {carId && (
        <>
          <p>Average Rating: {averageRating || "Loading..."}</p>

          {/* Rating submission form */}
          <form onSubmit={handleSubmit}>
            <h4>Leave a Rating</h4>
            <label>
              Rating (1-5):
              <input
                type="number"
                min="1"
                max="5"
                value={newRating}
                onChange={(e) => setNewRating(parseInt(e.target.value))}
                required
              />
            </label>
            <label>
              Comment:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </label>
            <button type="submit">Submit Rating</button>
          </form>
        </>
      )}

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default CarRating;
