/**
 * Mesob Market - Database Index Optimization Script
 * Creates recommended compound and text search indexes on MongoDB collections.
 * 
 * Usage:
 *   node backend/scripts/create_indexes.js [--dry-run]
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const INDEX_DEFINITIONS = [
  {
    collection: 'users',
    indexes: [
      { key: { email: 1 }, options: { unique: true, name: 'idx_user_email_unique' } },
      { key: { role: 1, createdAt: -1 }, options: { name: 'idx_user_role_created' } },
      { key: { 'lockout.isLocked': 1 }, options: { name: 'idx_user_lockout' } }
    ]
  },
  {
    collection: 'products',
    indexes: [
      { key: { name: 'text', description: 'text', tags: 'text' }, options: { name: 'idx_product_fulltext_search', weights: { name: 10, tags: 5, description: 1 } } },
      { key: { category: 1, price: 1 }, options: { name: 'idx_product_category_price' } },
      { key: { averageRating: -1, reviewCount: -1 }, options: { name: 'idx_product_ratings' } },
      { key: { isDeleted: 1, createdAt: -1 }, options: { name: 'idx_product_active_recency' } }
    ]
  },
  {
    collection: 'orders',
    indexes: [
      { key: { user: 1, createdAt: -1 }, options: { name: 'idx_order_user_created' } },
      { key: { status: 1, createdAt: -1 }, options: { name: 'idx_order_status_created' } },
      { key: { 'paymentInfo.tx_ref': 1 }, options: { sparse: true, name: 'idx_order_payment_tx_ref' } }
    ]
  },
  {
    collection: 'reviews',
    indexes: [
      { key: { product: 1, createdAt: -1 }, options: { name: 'idx_review_product_created' } },
      { key: { user: 1, product: 1 }, options: { unique: true, name: 'idx_review_user_product_unique' } }
    ]
  },
  {
    collection: 'communityposts',
    indexes: [
      { key: { author: 1, createdAt: -1 }, options: { name: 'idx_community_author_created' } },
      { key: { tags: 1 }, options: { name: 'idx_community_tags' } }
    ]
  }
];

export async function createIndexes() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log(`[Index Optimizer] Starting index sync (dry-run: ${isDryRun})...`);

  if (isDryRun) {
    console.log(`[Index Optimizer] Dry run mode enabled. Displaying index configurations:`);
    INDEX_DEFINITIONS.forEach(def => {
      console.log(`  Collection [${def.collection}]:`);
      def.indexes.forEach(idx => {
        console.log(`    - ${idx.options.name}: ${JSON.stringify(idx.key)}`);
      });
    });
    return;
  }

  try {
    const dotenv = (await import('dotenv')).default;
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
    const mongoose = (await import('mongoose')).default;

    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mesob_market';
    await mongoose.connect(mongoUri);
    console.log('[Index Optimizer] Connected to MongoDB database successfully.');

    const db = mongoose.connection.db;

    for (const def of INDEX_DEFINITIONS) {
      const col = db.collection(def.collection);
      for (const idx of def.indexes) {
        try {
          await col.createIndex(idx.key, idx.options);
          console.log(`  ✔ Created ${def.collection}.${idx.options.name}`);
        } catch (err) {
          console.warn(`  ⚠ ${def.collection}.${idx.options.name}: ${err.message}`);
        }
      }
    }

    await mongoose.disconnect();
    console.log('[Index Optimizer] Disconnected from database.');
  } catch (err) {
    console.error('[Index Optimizer] Index creation error:', err.message);
  }
}

// Execute if run from CLI
if (process.argv[1] && process.argv[1].endsWith('create_indexes.js')) {
  createIndexes();
}
