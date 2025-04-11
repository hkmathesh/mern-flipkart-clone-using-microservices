const mongoose = require("mongoose");

// Define Address Schema
const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: String,
    phone: String,
    pincode: String,
    locality: String,
    address: String,
    state: String,
    landmark: String,
    altPhone: String,
    addressType: String
});

// Create Address Model
const Address = mongoose.model("Address", addressSchema);

module.exports = Address