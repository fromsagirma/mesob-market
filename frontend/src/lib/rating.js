/**
 * Rating calculation and distribution utility.
 */

/**
 * Calculates the star fill states for a given rating.
 * @param {number} rating - Average rating (0 to 5)
 * @param {number} maxStars - Maximum number of stars (default: 5)
 * @returns {Array<{ index: number, filled: boolean, symbol: string }>}
 */
export function calculateStarDistribution(rating = 5, maxStars = 5) {
  const numericRating = Math.max(0, Math.min(maxStars, Number(rating) || 0));
  const fullStars = Math.floor(numericRating);

  return Array.from({ length: maxStars }, (_, i) => {
    const filled = i < fullStars;
    return {
      index: i,
      filled,
      symbol: filled ? '★' : '☆'
    };
  });
}

export function formatRatingLabel(rating, maxStars = 5) {
  const numericRating = Math.max(0, Math.min(maxStars, Number(rating) || 0));
  return `${numericRating.toFixed(1)} out of ${maxStars} stars`;
}

export default {
  calculateStarDistribution,
  formatRatingLabel
};
