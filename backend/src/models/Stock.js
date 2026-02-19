import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true, unique: true },
    name: { type: String, required: true },
    sector: { type: String, default: 'General' },
    currentPrice: { type: Number, required: true, min: 0 },
    change: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    marketCap: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Stock', stockSchema);
