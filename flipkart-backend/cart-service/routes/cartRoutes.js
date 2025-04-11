const express = require("express");
const { getCart, updateCart, updateCartQuantity, removeCartItem, clearCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/:userId", getCart);
router.post("/", updateCart);
router.put("/:userId", updateCartQuantity);
router.delete("/:userId/:productId", removeCartItem);
router.delete("/:userId", clearCart);

module.exports = router;
