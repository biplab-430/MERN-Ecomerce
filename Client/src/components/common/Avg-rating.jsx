import React, { useEffect, useState } from "react";
import StarratingComponent from "./Star-rating";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ use environment variable

function AverageRatingDisplay({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch all reviews for this product
  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shop/review/${productId}`);
        const reviewData = response.data?.reviews || [];

        setReviews(reviewData);

        // Calculate average rating
        if (reviewData.length > 0) {
          const avg =
            reviewData.reduce((acc, review) => acc + review.reviewValue, 0) /
            reviewData.length;
          setAverageRating(avg.toFixed(1));
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div className="flex items-center gap-2">
      <StarratingComponent rating={Math.round(averageRating)} />
      <span className="text-muted-foreground text-sm">({averageRating})</span>
      <span className="text-xs text-gray-500">• {reviews.length} reviews</span>
    </div>
  );
}

export default AverageRatingDisplay;
