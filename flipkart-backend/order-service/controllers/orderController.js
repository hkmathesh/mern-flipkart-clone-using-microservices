// Import Model
const Order = require("../models/Order");
const axios = require("axios");

// Save Orders
const placeOrder = async (req, res) => {
    try {
        console.log("Received Order Data:", req.body); // Debugging log

        const { userId, items, totalPrice, paymentMethod, addressId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order items cannot be empty" });
        }

        if (!addressId) {
            return res.status(400).json({ message: "Delivery address is required" });
        }

        const newOrder = new Order({ userId, items, totalPrice, paymentMethod, addressId });
        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch Orders for a Specific User
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Fetch all orders for user
        let orders = await Order.find({ userId }).sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(200).json([]);
        }

        // 1. Collect all unique productIds and addressIds
        const productIds = [];
        const addressIds = new Set();

        orders.forEach(order => {
            order.items.forEach(item => productIds.push(item.productId));
            addressIds.add(order.addressId.toString());
        });

        // 2. Fetch product details
        const productsUrl = new URL('/api/products/bulk', process.env.PRODUCT_SERVICE_URL).href;
        const productsResponse = await axios.post(productsUrl, { ids: productIds });

        // 3. Fetch address details
        const addressUrl = new URL('/api/addresses/bulk', process.env.ADDRESS_SERVICE_URL).href;
        const addressResponse = await axios.post(addressUrl, { ids: Array.from(addressIds) });

        const productsMap = {};
        productsResponse.data.forEach(p => productsMap[p._id] = p);

        const addressMap = {};
        addressResponse.data.forEach(a => addressMap[a._id] = a);

        // 4. Enrich the orders
        const enrichedOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.items.map(item => ({
                ...item.toObject(),
                product: productsMap[item.productId.toString()]
            })),
            address: addressMap[order.addressId.toString()]
        }));

        res.status(200).json(enrichedOrders);

    } catch (error) {
        console.error("Error in getUserOrders:", error);
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

module.exports = { placeOrder, getUserOrders };
