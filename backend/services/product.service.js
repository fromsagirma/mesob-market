import Product from '../models/product.model.js';

/**
 * Product catalog domain service.
 * Handles pricing/discount calculation, catalog filtering, and pagination.
 */

export const calculateDiscountedPrice = (price, discount = 0) => {
  const numPrice = Number(price) || 0;
  const numDiscount = Number(discount) || 0;
  if (numDiscount <= 0) return numPrice;
  if (numDiscount >= 100) return 0;
  return Number((numPrice - (numPrice * numDiscount) / 100).toFixed(2));
};

export const withDiscountedPrice = (productDoc) => {
  if (!productDoc) return null;
  const product = productDoc.toObject ? productDoc.toObject() : { ...productDoc };
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  return { ...product, discountedPrice };
};

export const buildProductFilter = ({ search, category, minPrice, maxPrice, status } = {}) => {
  const filter = {};

  if (search && typeof search === 'string' && search.trim()) {
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  if (category && typeof category === 'string' && category.trim()) {
    filter.category = { $regex: `^${category.trim()}$`, $options: 'i' };
  }

  if (status && typeof status === 'string' && status.trim()) {
    filter.status = status.trim();
  }

  if (minPrice != null || maxPrice != null) {
    filter.price = {};
    if (minPrice != null && !isNaN(Number(minPrice))) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice != null && !isNaN(Number(maxPrice))) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  return filter;
};

export const queryProducts = async (queryParams) => {
  const pageNum = Math.max(1, Number(queryParams.page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(queryParams.limit) || 10));
  const filter = buildProductFilter(queryParams);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    Product.countDocuments(filter)
  ]);

  return {
    products: products.map(withDiscountedPrice),
    total,
    page: pageNum,
    limit: limitNum
  };
};

export default {
  calculateDiscountedPrice,
  withDiscountedPrice,
  buildProductFilter,
  queryProducts
};
