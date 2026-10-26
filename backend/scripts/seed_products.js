/**
 * Mesob Market - Product Catalog Seeding Script
 * Seeds realistic Ethiopian marketplace products into MongoDB.
 * 
 * Usage:
 *   node backend/scripts/seed_products.js [--dry-run] [--clear]
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SAMPLE_PRODUCTS = [
  {
    name: 'Authentic Handwoven Habesha Kemis',
    description: 'Exquisite traditional Ethiopian dress woven with pure Shemane cotton, featuring intricate Tilf embroidery along the neckline and hemline.',
    price: 4500,
    discountPercentage: 10,
    category: 'Traditional Attire',
    stock: 25,
    coverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
    tags: ['traditional', 'cotton', 'habesha', 'dress', 'handmade'],
    averageRating: 4.9,
    reviewCount: 38,
    status: 'new'
  },
  {
    name: 'Yirgacheffe Single-Origin Specialty Coffee (1KG)',
    description: 'Washed Arabica beans from the high-altitude hills of Yirgacheffe, displaying vibrant floral jasmine aroma with bright citrus bergamot notes.',
    price: 1200,
    discountPercentage: 0,
    category: 'Coffee & Spices',
    stock: 120,
    coverImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
    tags: ['coffee', 'yirgacheffe', 'organic', 'arabica', 'beans'],
    averageRating: 4.8,
    reviewCount: 94,
    status: 'new'
  },
  {
    name: 'Traditional Clay Jebena (Coffee Pot)',
    description: 'Handcrafted black pottery Jebena for brewing authentic Ethiopian Buna ceremonies. Fire-cured and burnished for heat retention and aroma.',
    price: 850,
    discountPercentage: 5,
    category: 'Home & Crafts',
    stock: 40,
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    tags: ['jebena', 'pottery', 'buna', 'coffee ceremony', 'craft'],
    averageRating: 4.7,
    reviewCount: 42,
    status: 'new'
  },
  {
    name: 'Handcrafted Harari Colorful Mesob',
    description: 'Traditional coiled grass Mesob basket woven with natural vegetable-dyed reeds. Serves as decorative centerpiece and authentic injera dining table.',
    price: 3200,
    discountPercentage: 15,
    category: 'Home & Crafts',
    stock: 15,
    coverImage: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800',
    tags: ['mesob', 'harar', 'weaving', 'injera', 'art'],
    averageRating: 4.9,
    reviewCount: 29,
    status: 'new'
  },
  {
    name: 'Organic Berbere Spice Blend (500g)',
    description: 'Traditional Ethiopian multi-spice blend prepared with sun-dried red chili peppers, korarima, rue, fenugreek, garlic, and ginger.',
    price: 450,
    discountPercentage: 0,
    category: 'Coffee & Spices',
    stock: 200,
    coverImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    tags: ['berbere', 'spices', 'cooking', 'organic', 'wat'],
    averageRating: 4.6,
    reviewCount: 56,
    status: 'new'
  },
  {
    name: 'Pure Leather Men Messenger Bag',
    description: 'Full-grain Ethiopian highland cowhide leather laptop messenger bag with brass buckles and reinforced canvas lining.',
    price: 3800,
    discountPercentage: 8,
    category: 'Accessories & Leather',
    stock: 30,
    coverImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    tags: ['leather', 'bag', 'laptop', 'handmade', 'highland'],
    averageRating: 4.8,
    reviewCount: 33,
    status: 'new'
  }
];

export async function seedProducts() {
  const isDryRun = process.argv.includes('--dry-run');
  const shouldClear = process.argv.includes('--clear');

  console.log(`[Seed Script] Initializing catalog seed (dry-run: ${isDryRun}, clear: ${shouldClear})...`);

  if (isDryRun) {
    console.log(`[Seed Script] Dry run mode enabled. ${SAMPLE_PRODUCTS.length} sample products prepared:`);
    SAMPLE_PRODUCTS.forEach((p, idx) => console.log(`  ${idx + 1}. ${p.name} - ${p.price} ETB (${p.category})`));
    return;
  }

  try {
    const dotenv = (await import('dotenv')).default;
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
    const mongoose = (await import('mongoose')).default;

    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mesob_market';
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected to MongoDB database successfully.');

    const Product = (await import('../models/product.model.js')).default;

    if (shouldClear) {
      const deleted = await Product.deleteMany({});
      console.log(`[Seed Script] Cleared ${deleted.deletedCount} existing products.`);
    }

    const inserted = await Product.insertMany(SAMPLE_PRODUCTS);
    console.log(`[Seed Script] Successfully inserted ${inserted.length} catalog products!`);
    await mongoose.disconnect();
    console.log('[Seed Script] Disconnected from database.');
  } catch (err) {
    console.error('[Seed Script] Seeding error:', err.message);
  }
}

// Execute if run from CLI
if (process.argv[1] && process.argv[1].endsWith('seed_products.js')) {
  seedProducts();
}
