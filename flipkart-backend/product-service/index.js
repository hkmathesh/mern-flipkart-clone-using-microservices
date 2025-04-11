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
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true // optional: if you're using cookies or Firebase auth
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
