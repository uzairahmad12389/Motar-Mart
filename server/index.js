const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
// const carRoutes = require("./carRoutes");
const app = express();
app.use(express.json());
app.use(cors());

// Connect to PostgreSQL
const pool = new Pool({
    user: "postgres",        // Replace with your PostgreSQL username
    host: "localhost",
    database: "gui",         // Replace with your PostgreSQL database name
    password: "root",    // Replace with your PostgreSQL password
    port: 1234,                   // Default PostgreSQL port
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Failed to connect to PostgreSQL:", err));

    app.post('/signup', async (req, res) => {
        const { username, email, password } = req.body;
    
        try {
            // Check if user already exists
            const result = await pool.query("SELECT * FROM uzair WHERE email = $1", [email]);
            if (result.rows.length > 0) {
                return res.status(400).json({ error: "User already exists with this email" });
            }
    
            // Insert new user with plaintext password (not secure!)
            await pool.query(
                "INSERT INTO uzair (username, email, password) VALUES ($1, $2, $3)",
                [username, email, password]
            );
    
            res.status(201).json({ message: 'Signup successful' });
        } catch (err) {
            console.error('Error during signup:', err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    });
    

// API Route: Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists and passwords match
        const result = await pool.query(
            "SELECT * FROM uzair WHERE email = $1 AND password = $2",
            [email, password]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ message: "Login successful!", user: result.rows[0] });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/add-car", async (req, res) => {
    const { car_id, name, model, price, description, category, category_type, is_favorite } = req.body;

    // SQL query to insert a new car into the database
    const query = `
        INSERT INTO cars (car_id, name, model, price, description, category, category_type, is_favorite)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    try {
        // Execute the query
        const result = await pool.query(query, [
            car_id, name, model, price, description, category, category_type, is_favorite
        ]);

        // If the insertion is successful, return the newly added car data
        res.status(201).json({ message: "Car added successfully!", car: result.rows[0] });
    } catch (err) {
        console.error('Error adding car:', err);
        res.status(500).json({ error: "Failed to add car" });
    }
});
app.get("/get-car", async (req, res) => {
  const query = 'SELECT * FROM cars';

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/search", async (req, res) => {
    const { model } = req.query;
  
    if (!model) {
      return res.status(400).json({ message: "Model query parameter is required" });
    }
  
    try {
      const result = await pool.query(
        "SELECT * FROM cars WHERE model ILIKE $1",
        [`%${model}%`]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({ message: "Error fetching search results" });
    }
  });
app.get("/favor", async (req, res) => {
    const query = 'SELECT * FROM cars WHERE is_favorite = true';
  
    try {
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching favorite cars:", err);
      res.status(500).json({ error: "Failed to fetch favorite cars." });
    }
  });
app.get("/search", async (req, res) => {
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
app.get("/categories", async (req, res) => {
    const { categoryType } = req.query;
    try {
      const query = `
        SELECT car_id, name, model, price, description, category_type
        FROM cars
        WHERE category_type = $1;
      `;
      const result = await pool.query(query, [categoryType]);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching cars:", error.message);
      res.status(500).send("Server error");
    }
  });
  
  app.get("/api/cars/:carId/ratings", async (req, res) => {
    const { carId } = req.params;
    try {
      const result = await pool.query("SELECT * FROM ratings WHERE car_id = $1", [carId]);
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching ratings:", err);
      res.status(500).json({ message: "Error fetching ratings" });
    }
  });
  
  app.post('/api/compare', async (req, res) => {
    const { models } = req.body;

    // Ensure two models are selected for comparison
    if (models.length !== 2) {
        return res.status(400).send('Please select exactly two car models for comparison.');
    }

    try {
        // Query to get details of the selected car models
        const query = `
            SELECT * FROM cars
            WHERE model = ANY($1)
        `;
        const result = await pool.query(query, [models]);

        // If no results found for the given models
        if (result.rows.length === 0) {
            return res.status(404).send('Car models not found');
        }

        res.json(result.rows);
    } catch (err) {
        console.error('Error comparing cars:', err);
        res.status(500).send('Unable to compare cars. Please try again later.');
    }
});

  // Get average rating for a specific car
  app.get("/api/cars/:carId/average-rating", async (req, res) => {
    const { carId } = req.params;
    try {
      const result = await pool.query(
        "SELECT AVG(rating) AS average_rating FROM ratings WHERE car_id = $1",
        [carId]
      );
      const averageRating = result.rows[0].average_rating || 0;
      res.json({ averageRating });
    } catch (err) {
      console.error("Error fetching average rating:", err);
      res.status(500).json({ message: "Error fetching average rating" });
    }
  });
  
  // Submit a new rating for a car
  app.post("/api/cars/:carId/rate", async (req, res) => {
    const { carId } = req.params;
    const {  rating, comment } = req.body;
  
    // Validate input
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
  
    try {
      // Insert rating into the 'ratings' table
      const result = await pool.query(
        "INSERT INTO ratings (car_id, rating, comment) VALUES ($1, $2, $3) RETURNING *",
        [carId, rating, comment]
      );
      
      // Return the inserted rating
      res.json({ message: "Rating added successfully", rating: result.rows[0] });
    } catch (err) {
      console.error("Error adding rating:", err);
      res.status(500).json({ message: "Error adding rating" });
    }
  });
// Add a new dealership for a specific car
app.post("/api/dealerships", async (req, res) => {
    const { name, location, car_id } = req.body;
  
    // Validate input
    if (!name || !location || !car_id) {
      return res.status(400).json({ error: "Name, location, and car_id are required." });
    }
  
    try {
      // Check if the car exists in the cars table
      const carResult = await pool.query("SELECT * FROM cars WHERE car_id = $1", [car_id]);
      if (carResult.rows.length === 0) {
        return res.status(400).json({ error: "Car with the given ID does not exist." });
      }
  
      // Insert the dealership with the car_id
      const result = await pool.query(
        "INSERT INTO dealerships (name, location, car_id) VALUES ($1, $2, $3) RETURNING dealership_id, name, location, car_id",
        [name, location, car_id]
      );
  
      const newDealership = result.rows[0];
      res.status(201).json(newDealership); // Respond with the newly created dealership
    } catch (err) {
      console.error("Error adding dealership:", err);
      res.status(500).json({ error: "Unable to add dealership" });
    }
  });
  app.get('/api/getdealerships', async (req, res) => {
    try {
      const query = `
        SELECT dealerships.dealership_id, dealerships.name AS dealership_name, 
               dealerships.location, cars.name AS car_name, cars.model, cars.price 
        FROM dealerships 
        JOIN cars ON dealerships.car_id = cars.car_id
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching dealerships:', err);
      res.status(500).send('Unable to fetch dealerships. Please try again later.');
    }
  });
  
// app.use("/api", carRoutes);
// Start Server
app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000"); 
}); 
