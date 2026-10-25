import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASS;
    const name = process.env.ADMIN_NAME || 'Administrator';

    if (!email || !password) {
      console.error('Error: Please provide ADMIN_EMAIL and ADMIN_PASS environment variables.');
      process.exit(1);
    }

    let user = await User.findOne({ email: String(email).toLowerCase().trim() });

    if (!user) {
      user = new User({
        name,
        email: String(email).toLowerCase().trim(),
        password,
        role: ['admin'],
        isVerified: true,
      });
      await user.save();
      console.log('Admin user created with provided password:', email);
      process.exit(0);
    }

    user.password = password;
    user.isVerified = true;
    if (!Array.isArray(user.role) || !user.role.includes('admin')) {
      user.role = Array.isArray(user.role) ? [...new Set([...(user.role || []), 'admin'])] : ['admin'];
    }

    await user.save();
    console.log('Admin password reset for:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin password:', err);
    process.exit(1);
  }
};

run();
