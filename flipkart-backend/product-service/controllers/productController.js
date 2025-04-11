// Import Model
const Product = require("../models/Product");

// Fetch all Products
const getAllProducts = async (req, res) => {
    try {
        const category = req.query.category;
        // console.log(category)
        let products;
        if (category) {
            products = await Product.find({ category });
        } else {
            products = await Product.find();
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
};

// Fetch Product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id); // Use findById to fetch product by ID

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product); // Return the product if found
    } catch (error) {
        res.status(500).json({ error: "Error fetching product details" });
    }
};

// Fetch Bulk Products
const getBulkProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.body.ids } });
        res.json(products);
    } catch (err) {
        console.error("Error fetching bulk products:", err);
        res.status(500).send("Server error");
    }
};

module.exports = { getAllProducts, getProductById, getBulkProducts };
