/**
 * Request validation schemas for product ratings and verified reviews.
 */

export const submitReviewSchema = {
  body: {
    rating: {
      type: 'number',
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: 'string',
      maxLength: 120
    },
    content: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 1500
    }
  },
  params: {
    id: {
      type: 'string',
      required: true
    }
  }
};

export const reviewEligibilitySchema = {
  params: {
    id: {
      type: 'string',
      required: true
    }
  }
};

export default {
  submitReviewSchema,
  reviewEligibilitySchema
};
