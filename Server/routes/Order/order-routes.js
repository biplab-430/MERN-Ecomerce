const express = require("express");
const { createOrder, capturePayment ,getAllOrderByUser,getOrderDetails} = require("../../controllers/shop/Order-controller");

const router = express.Router();

// ✅ Create new order & initiate PayPal transaction
router.post("/create", createOrder);

// ✅ Capture PayPal payment (after user approves)
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrderByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
