require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// Middleware
app.use(express.json()) // Middleware to parse JSON requests

// Enable CORS for frontend access
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true // optional: if you're using cookies or Firebase auth
}));

console.log("Allowed frontend:", process.env.FRONTEND_URL);

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
    res.send("🛒 Cart Service is live!")
})

const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
    console.log(`Cart Service running on port ${PORT}`)
);
