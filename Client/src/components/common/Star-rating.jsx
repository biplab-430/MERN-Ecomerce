import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

function StarratingComponent({ rating = 0, handleRatingChange }) {
  return (
    <div className="flex gap-2 items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= rating;

        return (
          <Button
            key={star}
            variant="outline"
            size="icon"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            onClick={handleRatingChange ? () => handleRatingChange(star) : undefined}
            className={`p-2 rounded-full transition-all duration-200 
              ${isActive
                ? "text-yellow-400 border-yellow-400 bg-yellow-50 hover:bg-yellow-100"
                : "text-gray-400 hover:text-yellow-400 hover:bg-gray-100"
              }`}
          >
            <StarIcon
              className={`w-5 h-5 transition-transform duration-150 ${
                isActive ? "scale-110" : "scale-100"
              }`}
              fill={isActive ? "currentColor" : "none"}
            />
          </Button>
        );
      })}
    </div>
  );
}

export default StarratingComponent;
