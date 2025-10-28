const Review = require("../../Models/Review"); // adjust path if needed

// ✅ Add a new review/comment
const addReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Basic validation
    if (!productId || !userId || !userName || !reviewMessage || !reviewValue) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newReview = new Review({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server error while adding review." });
  }
};

// ✅ Get all reviews for a specific product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error while fetching reviews." });
  }
};

module.exports = { addReview, getProductReviews };
