import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddDealership.css";

const AddDealership = () => {
  const [cars, setCars] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [carId, setCarId] = useState(""); // Selected car ID
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  // Fetch all car models
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-car");
        setCars(response.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Unable to fetch cars. Please try again later.");
      }
    };

    fetchCars();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !location || !carId) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/dealerships", {
        name,
        location,
        car_id: carId,
      });

      setSuccessMessage(`Dealership "${response.data.name}" added successfully!`);
      setError(""); // Reset error message if successful
      setName("");
      setLocation("");
      setCarId(""); // Reset car selection
    } catch (err) {
      console.error("Error adding dealership:", err);
      setError("Unable to add dealership. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="add-dealership-container">
      <h2>Add New Dealership</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Dealership Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="carId">Select Car</label>
          <select
            id="carId"
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a car
            </option>
            {cars.map((car) => (
              <option key={car.car_id} value={car.car_id}>
                {car.name} ({car.model})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Dealership</button>
      </form>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
      Back to Dashboard
      </button>
    </div>
  );
};

export default AddDealership;
