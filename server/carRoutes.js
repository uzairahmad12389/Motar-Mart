const express = require("express");
const pool = require("./index"); // Import PostgreSQL connection

const router = express.Router();

// Create a new car
router.post("/cars", async (req, res) => {
  const { carId, name, model, price, description, category, categoryType, isFavorite } = req.body;

  const validCategories = [
    "Toyota Corolla", "Honda Civic", "Tesla Model S", "Ford Mustang",
    "Chevrolet Camaro", "BMW X5", "Audi A6", "Mercedes-Benz C-Class",
    "Kia Sportage", "Hyundai Elantra"
  ];
  const validCategoryTypes = ["SUV", "sedan", "hatchback", "coupe", "convertible"];

  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(", ")}` });
  }
  if (!validCategoryTypes.includes(categoryType)) {
    return res.status(400).json({ error: `Invalid category type. Must be one of: ${validCategoryTypes.join(", ")}` });
  }

  const query = `
    INSERT INTO cars (car_id, name, model, price, description, category, category_type, is_favorite)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
  `;

  const values = [carId, name, model, price, description, category, categoryType, isFavorite || false];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all cars
router.get("/cars", async (req, res) => {
  const query = 'SELECT * FROM cars';

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorite cars
router.get("/cars/favorites", async (req, res) => {
  const query = 'SELECT * FROM cars WHERE is_favorite = true';

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorite cars." });
  }
});

// Get cars by category type
router.get("/cars/category", async (req, res) => {
  const { categoryType } = req.query;

  if (!categoryType) {
    return res.status(400).json({ error: "CategoryType query parameter is required." });
  }

  const query = 'SELECT * FROM cars WHERE category_type = $1';
  
  try {
    const result = await pool.query(query, [categoryType]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cars by category." });
  }
});

// Add a rating to a car
router.post("/cars/:id/rate", async (req, res) => {
  const { id } = req.params; 
  const { userId, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  const query = `
    INSERT INTO car_ratings (car_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  
  try {
    const result = await pool.query(query, [id, userId, rating, comment]);
    res.status(201).json({ message: "Rating added successfully.", rating: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to add rating." });
  }
});

// Get ratings for a car
router.get("/cars/:id/ratings", async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM car_ratings WHERE car_id = $1';

  try {
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ratings." });
  }
});

// Calculate average rating for a car
router.get("/cars/:id/average-rating", async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT AVG(rating) AS average_rating FROM car_ratings WHERE car_id = $1';

  try {
    const result = await pool.query(query, [id]);
    const averageRating = result.rows[0].average_rating || 0;
    res.json({ averageRating: averageRating.toFixed(1) });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate average rating." });
  }
});

// Search for cars based on model
router.get("/search", async (req, res) => {
  console.log("ok");
  const { model } = req.query;

  if (!model) {
    return res.status(400).json({ error: "Model query parameter is required." });
  }

  const query = 'SELECT * FROM cars WHERE model ILIKE $1 ORDER BY model';

  try {
    const result = await pool.query(query, [`%${model}%`]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to search cars." });
  }
});

// Compare multiple cars by their IDs
router.post("/compare", async (req, res) => {
  const { carIds } = req.body;

  if (carIds.length < 2) {
    return res.status(400).json({ error: "At least two car IDs are required for comparison." });
  }

  const query = 'SELECT * FROM cars WHERE car_id = ANY($1)';

  try {
    const result = await pool.query(query, [carIds]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cars for comparison." });
  }
});

module.exports = router;
