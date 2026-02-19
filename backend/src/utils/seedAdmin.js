import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@tradex.dev';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await User.create({
    name: 'Tradex Admin',
    email,
    password: process.env.ADMIN_PASSWORD || 'Admin123!',
    role: 'admin'
  });

  console.log('Admin user seeded');
  process.exit(0);
};

seed();
