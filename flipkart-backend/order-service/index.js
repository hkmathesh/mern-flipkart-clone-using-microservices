require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const orderRoutes = require("./routes/orderRoutes");

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
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("📬 Order Service is live!");
})

const PORT = process.env.PORT || 5003;
app.listen(PORT, () =>
    console.log(`Order Service running on port ${PORT}`)
);
