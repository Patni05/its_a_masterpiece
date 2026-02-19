import mongoose from 'mongoose';

const stockHistorySchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    volume: { type: Number, default: 0 },
    source: { type: String, default: 'simulated' },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

stockHistorySchema.index({ symbol: 1, timestamp: -1 });

export default mongoose.model('StockHistory', stockHistorySchema);
