const mongoose = require("mongoose");

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // Add category field
    specifications: { type: Object, default: {} }, // Store all product-specific details dynamically
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String } // Store the image URL here
});

// Create Product Model
const Product = mongoose.model("Product", productSchema)

module.exports = Product