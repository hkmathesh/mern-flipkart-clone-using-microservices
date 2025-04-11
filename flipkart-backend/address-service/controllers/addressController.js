// Import Model
const Address = require("../models/Address");

// Save an address
const saveAddress = async (req, res) => {
    try {
        const { userId, ...addressData } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const newAddress = new Address({ userId, ...addressData });
        await newAddress.save();

        res.status(201).json({ message: "Address saved successfully!", address: newAddress });
    } catch (error) {
        console.error("Error saving address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch addresses for a specific user
const getUserAddresses = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const addresses = await Address.find({ userId });
        res.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update an address
const updateAddress = async (req, res) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Address updated successfully!", address: updatedAddress });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch Bulk Addresses
const getBulkAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ _id: { $in: req.body.ids } });
        res.json(addresses);
    } catch (error) {
        console.error("Error fetching bulk addresses:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { saveAddress, getUserAddresses, updateAddress, getBulkAddresses };
