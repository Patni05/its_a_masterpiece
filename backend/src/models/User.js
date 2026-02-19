import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    balance: { type: Number, default: 10000 },
    holdings: [
      {
        symbol: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        averagePrice: { type: Number, required: true, min: 0 }
      }
    ],
    resetToken: { type: String },
    resetTokenExpires: { type: Date }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
