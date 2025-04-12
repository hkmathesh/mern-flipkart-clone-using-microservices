require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(express.json()) // Middleware to parse JSON requests

// Enable CORS for frontend access
const allowedOrigins = [
    'http://localhost:5173',
    'https://mern-flipkart-microservices-frontend.onrender.com'
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));  

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.send("📦 Product Service is live!");
})

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
    console.log(`Product Service running on port ${PORT}`)
);
