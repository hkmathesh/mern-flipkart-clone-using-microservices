const express = require("express");
const { getAllProducts, getProductById, getBulkProducts } = require("../controllers/productController");

const router = express.Router();

// Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/bulk", getBulkProducts);

module.exports = router;
