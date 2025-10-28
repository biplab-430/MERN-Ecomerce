const express = require("express");
const { addReview, getProductReviews } = require("../../controllers/Review/review-controller");

const router = express.Router();

// ✅ Add new review
router.post("/add", addReview);

// ✅ Get all reviews for a product
router.get("/:productId", getProductReviews);

module.exports = router;
