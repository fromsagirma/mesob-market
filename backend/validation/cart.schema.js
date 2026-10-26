import mongoose from 'mongoose';

/**
 * Request validation schemas for shopping cart endpoints.
 */

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value) || 'Invalid cart ID format';

const validateCartItems = (items) => {
  if (!Array.isArray(items)) return 'Items must be an array';
  for (const item of items) {
    const productId = item?.product || item?.productId;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return 'Each item must have a valid product identifier';
    }
    const qty = Number(item?.quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return 'Each item quantity must be at least 1';
    }
  }
  return true;
};

export const syncCartSchema = {
  body: {
    items: {
      type: 'array',
      required: true,
      custom: validateCartItems
    }
  }
};

export const cartIdParamSchema = {
  params: {
    id: {
      type: 'string',
      required: true,
      custom: isValidObjectId
    }
  }
};

export default {
  syncCartSchema,
  cartIdParamSchema
};
