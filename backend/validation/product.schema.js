import mongoose from 'mongoose';

/**
 * Request validation schemas for product queries and mutations.
 */

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value) || 'Invalid product ID format';

export const queryProductsSchema = {
  query: {
    page: {
      type: 'number',
      min: 1
    },
    limit: {
      type: 'number',
      min: 1,
      max: 100
    },
    minPrice: {
      type: 'number',
      min: 0
    },
    maxPrice: {
      type: 'number',
      min: 0
    },
    status: {
      type: 'string',
      enum: ['used', 'slightly used', 'new']
    }
  }
};

export const productIdParamSchema = {
  params: {
    id: {
      type: 'string',
      required: true,
      custom: isValidObjectId
    }
  }
};

export const createProductSchema = {
  body: {
    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 150
    },
    description: {
      type: 'string',
      required: true,
      minLength: 5
    },
    category: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number',
      required: true,
      min: 0
    },
    stock: {
      type: 'number',
      required: true,
      min: 0
    },
    discount: {
      type: 'number',
      min: 0,
      max: 100
    },
    status: {
      type: 'string',
      enum: ['used', 'slightly used', 'new']
    }
  }
};

export default {
  queryProductsSchema,
  productIdParamSchema,
  createProductSchema
};
