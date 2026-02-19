import Stock from '../models/Stock.js';
import StockHistory from '../models/StockHistory.js';

export const getStocks = async (req, res) => {
  const { q } = req.query;
  const query = q
    ? {
        $or: [
          { symbol: { $regex: q, $options: 'i' } },
          { name: { $regex: q, $options: 'i' } }
        ]
      }
    : {};

  const stocks = await Stock.find({ ...query, isActive: true }).sort({ symbol: 1 });
  res.json(stocks);
};

export const getStockBySymbol = async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = await Stock.findOne({ symbol });
  if (!stock) return res.status(404).json({ message: 'Stock not found' });

  const history = await StockHistory.find({ symbol }).sort({ timestamp: -1 }).limit(100);
  res.json({ stock, history: history.reverse() });
};

export const getStockAnalytics = async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const history = await StockHistory.find({ symbol }).sort({ timestamp: -1 }).limit(300);
  if (!history.length) return res.status(404).json({ message: 'No data available' });

  const prices = history.map((h) => h.price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const avg = Number((prices.reduce((acc, price) => acc + price, 0) / prices.length).toFixed(2));

  res.json({
    symbol,
    points: history.reverse(),
    analytics: {
      max,
      min,
      avg,
      trend: Number((prices[0] - prices[prices.length - 1]).toFixed(2))
    }
  });
};
