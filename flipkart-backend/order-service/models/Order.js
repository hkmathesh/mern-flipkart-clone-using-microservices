const mongoose = require("mongoose");

// Define Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true }, // Reference Address model
    orderDate: { type: Date, default: Date.now }
});

// Create Order Model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
