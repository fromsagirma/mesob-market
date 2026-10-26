import mongoose from 'mongoose';
import { VALID_ORDER_STATUSES } from '../services/order.service.js';

/**
 * Request validation schemas for customer orders and administrative status management.
 */

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value) || 'Invalid order ID format';

const validateOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 'Order items array cannot be empty';
  }
  for (const item of items) {
    const productId = item?.productId || item?.product;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return 'Each item must have a valid productId';
    }
    const qty = Number(item?.quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return 'Each item quantity must be at least 1';
    }
  }
  return true;
};

export const createOrderSchema = {
  body: {
    items: {
      type: 'array',
      required: true,
      custom: validateOrderItems
    },
    totalPrice: {
      type: 'number',
      min: 0
    },
    status: {
      type: 'string',
      enum: VALID_ORDER_STATUSES
    }
  }
};

export const orderStatusTransitionSchema = {
  body: {
    status: {
      type: 'string',
      required: true,
      enum: VALID_ORDER_STATUSES
    }
  },
  params: {
    id: {
      type: 'string',
      required: true,
      custom: isValidObjectId
    }
  }
};

export const orderIdParamSchema = {
  params: {
    id: {
      type: 'string',
      required: true,
      custom: isValidObjectId
    }
  }
};

export default {
  createOrderSchema,
  orderStatusTransitionSchema,
  orderIdParamSchema
};
