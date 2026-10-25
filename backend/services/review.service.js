import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Review from '../models/review.model.js';
import Order from '../models/order.model.js';

/**
 * Product review and verified rating domain service.
 * Enforces verified purchase constraints and calculates rating aggregate stats.
 */

export const formatReviewDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const serializeReview = (reviewDoc) => {
  const review = reviewDoc.toObject ? reviewDoc.toObject() : reviewDoc;
  const authorName = review.userId?.name || 'Anonymous';

  return {
    _id: review._id,
    productKey: review.productKey,
    productId: review.productId,
    userId: review.userId?._id || review.userId,
    rating: review.rating,
    title: review.title,
    content: review.comment,
    verified: Boolean(review.verifiedPurchase),
    author: authorName,
    date: formatReviewDate(review.createdAt),
    createdAt: review.createdAt,
    updatedAt: review.updatedAt
  };
};

export const checkPurchaseVerification = async (userId, productId) => {
  if (!userId || !productId) return false;
  if (!mongoose.Types.ObjectId.isValid(productId)) return false;

  const exists = await Order.exists({
    userId,
    paymentStatus: 'paid',
    'items.productId': productId
  });

  return Boolean(exists);
};

export const updateProductRatingStats = async ({ productKey, productId }) => {
  const stats = await Review.aggregate([
    {
      $match: {
        productKey
      }
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  const rawAverage = stats[0]?.averageRating || 0;
  const reviewCount = stats[0]?.reviewCount || 0;
  const averageRating = Number(rawAverage.toFixed(1));

  if (productId && mongoose.Types.ObjectId.isValid(productId)) {
    await Product.findByIdAndUpdate(productId, {
      averageRating,
      reviewCount
    });
  }

  return {
    averageRating,
    reviewCount
  };
};

export default {
  formatReviewDate,
  serializeReview,
  checkPurchaseVerification,
  updateProductRatingStats
};
