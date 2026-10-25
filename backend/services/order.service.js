import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import { calculateDiscountedPrice } from './product.service.js';

/**
 * Order processing and lifecycle domain service.
 * Manages order items resolution, pricing verification, and status state transitions.
 */

export const VALID_ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export const isValidOrderStatus = (status) => {
  return typeof status === 'string' && VALID_ORDER_STATUSES.includes(status.toLowerCase().trim());
};

export const resolveOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order items array cannot be empty');
  }

  const productIds = items
    .map((item) => item.productId || item.product)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (productIds.length !== items.length) {
    throw new Error('Each item must include a valid productId');
  }

  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const missing = items.find((item) => !productMap.has(String(item.productId || item.product)));
  if (missing) {
    throw new Error(`Product not found: ${missing.productId || missing.product}`);
  }

  const resolvedItems = items.map((item) => {
    const id = String(item.productId || item.product);
    const product = productMap.get(id);
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const unitPrice = calculateDiscountedPrice(product.price, product.discount);

    return {
      productId: product._id,
      name: product.name,
      price: unitPrice,
      quantity
    };
  });

  const calculatedTotal = Number(
    resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );

  return { resolvedItems, calculatedTotal };
};

export const transitionOrderStatus = async (orderId, newStatus) => {
  const normalizedStatus = String(newStatus).toLowerCase().trim();
  if (!isValidOrderStatus(normalizedStatus)) {
    throw new Error(`Invalid order status: ${newStatus}`);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  order.status = normalizedStatus;
  await order.save();
  return order;
};

export default {
  VALID_ORDER_STATUSES,
  isValidOrderStatus,
  resolveOrderItems,
  transitionOrderStatus
};
