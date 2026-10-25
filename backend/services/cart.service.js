import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { calculateDiscountedPrice } from './product.service.js';

/**
 * Shopping cart domain service.
 * Handles pricing normalization against database records, subtotal calculations,
 * and user cart state persistence.
 */

export const normalizeAndPriceItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { normalizedItems: [], totalPrice: 0 };
  }

  const rawProductIds = items.map((it) => it.product || it.productId).filter(Boolean);
  const productIds = rawProductIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (productIds.length !== items.length) {
    throw new Error('Each item must include a valid product or productId');
  }

  const products = await Product.find({ _id: { $in: productIds } }).select('price discount');
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const normalizedItems = items.map((it) => {
    const productId = String(it.product || it.productId);
    const product = productMap.get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    const quantity = Math.max(1, Number(it.quantity) || 1);
    const unitPrice = calculateDiscountedPrice(product.price, product.discount);

    return {
      product: product._id,
      quantity,
      price: unitPrice
    };
  });

  const totalPrice = Number(
    normalizedItems.reduce((sum, it) => sum + it.price * it.quantity, 0).toFixed(2)
  );

  return { normalizedItems, totalPrice };
};

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    return { user: userId, items: [], totalPrice: 0 };
  }
  return cart;
};

export const syncCartItems = async (userId, items) => {
  const { normalizedItems, totalPrice } = await normalizeAndPriceItems(items);

  let cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = normalizedItems;
    cart.totalPrice = totalPrice;
    await cart.save();
    return Cart.findById(cart._id).populate('items.product');
  }

  const newCart = new Cart({ user: userId, items: normalizedItems, totalPrice });
  await newCart.save();
  return Cart.findById(newCart._id).populate('items.product');
};

export default {
  normalizeAndPriceItems,
  getOrCreateCart,
  syncCartItems
};
