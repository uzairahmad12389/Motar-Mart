import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import './AddCar.css';


const AddCar = () => {
  const [formData, setFormData] = useState({
    car_id: "",
    name: "",
    model: "",
    price: "",
    description: "",
    category: "",
    category_type: "",
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const categories = [
    "Toyota Corolla", "Honda Civic", "Tesla Model S", "Ford Mustang",
    "Chevrolet Camaro", "BMW X5", "Audi A6", "Mercedes-Benz C-Class",
    "Kia Sportage", "Hyundai Elantra"
  ];

  const categoryTypes = ["SUV", "sedan", "hatchback", "coupe", "convertible"];
  const navigate = useNavigate();  // Initialize the navigate function from React Router

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const carData = {
      ...formData,
      is_favorite: isFavorite,
    };
  
    try {
      const response = await fetch('http://localhost:4000/add-car', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carData),
      });
  
      if (response.ok) {
        alert("Car added successfully!");
        setFormData({
          car_id: "",
          name: "",
          model: "",
          price: "",
          description: "",
          category: "",
          category_type: "",
        });
        setIsFavorite(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to add car: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Back button handler
  const goBackToDashboard = () => {
    navigate("/dashboard");  // Navigate to the Dashboard route
  };

  return (
    <div className="add-car-container">
      <h2>Add a New Car</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="car_id"
          placeholder="Car ID"
          value={formData.car_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Car Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Car Model"
          value={formData.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Car Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Car Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <div className="favorite-checkbox">
          <label>Mark as Favorite:</label>
          <input 
            type="checkbox" 
            checked={isFavorite}
            onChange={toggleFavorite}
          />
        </div>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          name="category_type"
          value={formData.category_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Category Type</option>
          {categoryTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
        <button className="back-button" type="submit">Add Car</button>
      </form>
      {/* Back Button */}
      <button className="back-button" onClick={goBackToDashboard}>
  Back to Dashboard
</button>

    </div>
  );
};

export default AddCar;
