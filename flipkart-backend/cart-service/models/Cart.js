const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: {
                type: Number,
                default: 1,
                min: [1, "Quantity can't be less than 1"]
            }, // Store only quantity, price will be fetched from Product collection
        }
    ]
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
