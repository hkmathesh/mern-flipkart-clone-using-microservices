const express = require("express");
const { saveAddress, getUserAddresses, updateAddress, getBulkAddresses } = require("../controllers/addressController");

const router = express.Router();

router.post("/", saveAddress);
router.get("/:userId", getUserAddresses);
router.put("/:id", updateAddress);
router.post("/bulk", getBulkAddresses);

module.exports = router;
