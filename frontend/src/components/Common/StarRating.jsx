import React from 'react';
import { calculateStarDistribution, formatRatingLabel } from '../../lib/rating.js';

export { calculateStarDistribution, formatRatingLabel };

/**
 * StarRating component
 * Displays accessible 5-star rating visualization.
 */
export default function StarRating({ rating = 5, size = "sm", className = "" }) {
  const stars = calculateStarDistribution(rating, 5);
  const sizeClass = size === "lg" ? "text-2xl" : size === "md" ? "text-base" : "text-xs";

  return (
    <div
      className={`flex gap-0.5 text-yellow-400 ${className}`}
      aria-label={formatRatingLabel(rating, 5)}
      role="img"
    >
      {stars.map((star) => (
        <span key={star.index} className={sizeClass} aria-hidden="true">
          {star.symbol}
        </span>
      ))}
    </div>
  );
}
