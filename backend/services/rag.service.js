import { GoogleGenerativeAI } from '@google/generative-ai';
import Fuse from 'fuse.js';
import Product from '../models/product.model.js';
import { calculateDiscountedPrice } from './product.service.js';

/**
 * AI Shopping Assistant and RAG retrieval service.
 * Manages Gemini API integration, timeout retry logic, and Fuse.js fuzzy candidate matching.
 */

let genAIInstance = null;

export const getGeminiClient = () => {
  if (!genAIInstance && process.env.GEMINI_API_KEY) {
    genAIInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAIInstance;
};

export const retryGeminiCall = async (generateContentFn, maxRetries = 2, perAttemptTimeoutMs = 15000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const attemptPromise = generateContentFn();

      const timeoutPromise = new Promise((_, reject) => {
        const id = setTimeout(() => {
          const toErr = new Error('Gemini request timed out');
          toErr.isTimeout = true;
          reject(toErr);
        }, perAttemptTimeoutMs);

        if (attemptPromise && typeof attemptPromise.then === 'function') {
          attemptPromise.then(() => clearTimeout(id)).catch(() => clearTimeout(id));
        }
      });

      return await Promise.race([attemptPromise, timeoutPromise]);
    } catch (error) {
      const msg = (error && (error.message || '')) || '';

      if (error && error.isTimeout) {
        if (attempt < maxRetries) {
          console.log(`Gemini request timed out (attempt ${attempt}/${maxRetries}), retrying...`);
          continue;
        }

        const rateError = new Error('Gemini timed out after retries');
        rateError.isRateLimit = true;
        rateError.retryAfterMs = perAttemptTimeoutMs;
        rateError.permanentQuota = true;
        throw rateError;
      }

      const isRate = msg.includes('429') || msg.includes('Too Many Requests') || error?.code === 429;
      if (isRate) {
        let retryDelay = 21000;
        const retryMsMatch = msg.match(/retryDelay["\s]*:\s*["']?(\d+)s?/i);
        const retrySecMatch = msg.match(/Retry-After["\s]*[:=]?\s*["']?(\d+)/i);
        if (retryMsMatch) retryDelay = parseInt(retryMsMatch[1], 10) * 1000;
        else if (retrySecMatch) retryDelay = parseInt(retrySecMatch[1], 10) * 1000;

        if (attempt < maxRetries) {
          console.log(`Quota exceeded, retrying in ${retryDelay}ms (attempt ${attempt}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }

        const rateError = new Error('Rate limit exceeded');
        rateError.isRateLimit = true;
        rateError.retryAfterMs = retryDelay;
        rateError.permanentQuota = true;
        throw rateError;
      }

      throw error;
    }
  }
};

export const fuzzySearchProducts = async (query, limit = 10) => {
  try {
    if (!query || typeof query !== 'string') return [];
    const cleaned = String(query).replace(/[^a-z0-9\s]/gi, ' ').trim();
    if (!cleaned) return [];

    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      const andConditions = words.map((w) => ({
        $or: [
          { name: { $regex: w, $options: 'i' } },
          { category: { $regex: w, $options: 'i' } },
          { description: { $regex: w, $options: 'i' } }
        ]
      }));

      const regexMatches = await Product.find({ $and: andConditions }).limit(Math.max(limit, 20)).lean();
      if (regexMatches && regexMatches.length > 0) return regexMatches;
    }

    const candidates = await Product.find({}).sort({ averageRating: -1 }).limit(300).lean();
    if (!candidates || candidates.length === 0) return [];

    const fuse = new Fuse(candidates, {
      keys: ['name', 'category', 'description'],
      threshold: 0.35,
      ignoreLocation: true
    });

    const results = fuse.search(cleaned, { limit });
    return results.map((r) => r.item);
  } catch (err) {
    console.error('fuzzySearchProducts error:', err);
    return [];
  }
};

export const mapProductsWithContext = (products = [], reviewMap = new Map()) => {
  return products.map((product) => {
    const reviews = reviewMap.get(String(product._id)) || [];
    const stock = Number(product.stock) || 0;
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

    let inventoryNote = 'In stock';
    if (stock <= 0) inventoryNote = 'Currently sold out';
    else if (stock <= 3) inventoryNote = `Only ${stock} left`;

    return {
      _id: product._id,
      name: product.name,
      category: product.category,
      coverImage: product.coverImage,
      status: product.status,
      price: product.price,
      discountedPrice,
      averageRating: Number(product.averageRating || 0),
      reviewCount: Number(product.reviewCount || 0),
      stock,
      inventoryNote,
      reviews: reviews.slice(0, 3).map((r) => ({ title: r.title, comment: r.comment, rating: r.rating }))
    };
  });
};

export default {
  getGeminiClient,
  retryGeminiCall,
  fuzzySearchProducts,
  mapProductsWithContext
};
