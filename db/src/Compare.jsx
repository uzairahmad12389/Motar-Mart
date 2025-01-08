import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Compare.css"; // Include styles here

const CarComparison = () => {
  const [carModels, setCarModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]); // Store selected car models by index
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarModels();
  }, []);

  const fetchCarModels = async () => {
    try {
      const response = await axios.get("http://localhost:4000/get-car");
      setCarModels(response.data);
    } catch (err) {
      console.error("Error fetching car models:", err);
      setError("Unable to fetch car models. Please try again later.");
    }
  };

  const handleSelect = (e) => {
    const model = e.target.value;
    if (selectedModels.length < 2 && !selectedModels.includes(model)) {
      setSelectedModels((prevModels) => [...prevModels, model]);
    } else if (selectedModels.includes(model)) {
      setSelectedModels((prevModels) => prevModels.filter((m) => m !== model));
    }
  };

  const handleCompare = async () => {
    if (selectedModels.length !== 2) {
      setError("Please select exactly two car models for comparison.");
      return;
    }
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/api/compare", {
        models: selectedModels,
      });
      setComparisonData(response.data);
    } catch (err) {
      console.error("Error comparing cars:", err);
      setError("Unable to compare cars. Please try again later.");
    }
  };

  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="car-comparison-container">
      <h2>Compare Cars</h2>

      {error && <p className="error">{error}</p>}

      <div className="dropdown">
        <label>Select Car Models: </label>
        <select onChange={handleSelect} value="">
          <option value="" disabled>
            Select a car
          </option>
          {carModels.map((car) => (
            <option key={car.car_id} value={car.model}>
              {car.name} ({car.model})
            </option>
          ))}
        </select>
      </div>

      <div className="selected-models">
        <h3>Selected Models:</h3>
        {selectedModels.length > 0 ? (
          selectedModels.map((model, index) => (
            <p key={index}>
              {model}
              <button onClick={() => handleSelect({ target: { value: model } })}>
                Deselect
              </button>
            </p>
          ))
        ) : (
          <p>No models selected</p>
        )}
      </div>

      <button onClick={handleCompare} className="compare-btn">
        Compare
      </button>

      {comparisonData && (
        <div className="comparison-result">
          <h3>Comparison Result:</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>CAR NAME</th>
                <th>
                  {comparisonData[0].name} ({comparisonData[0].model})
                </th>
                <th>
                  {comparisonData[1].name} ({comparisonData[1].model})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Price</th>
                <th>${comparisonData[0].price}</th>
                <th>${comparisonData[1].price}</th>
              </tr>
              <tr>
                <th>Description</th>
                <th>{comparisonData[0].description}</th>
                <th>{comparisonData[1].description}</th>
              </tr>
              {/* Add more rows for additional comparison features */}
            </tbody>
          </table>
        </div>
      )}

      <button className="back-button" onClick={goBackToDashboard}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default CarComparison;
