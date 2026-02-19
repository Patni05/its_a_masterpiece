import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Stock from '../models/Stock.js';
import User from '../models/User.js';

export const placeOrder = async (req, res) => {
  const { symbol, type, quantity } = req.body;
  const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
  if (!stock) return res.status(404).json({ message: 'Stock not available' });

  const user = await User.findById(req.user._id);
  const total = Number((stock.currentPrice * quantity).toFixed(2));

  if (type === 'buy') {
    if (user.balance < total) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    user.balance = Number((user.balance - total).toFixed(2));

    const existing = user.holdings.find((h) => h.symbol === stock.symbol);
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      existing.averagePrice = Number(
        ((existing.averagePrice * existing.quantity + total) / newQuantity).toFixed(2)
      );
      existing.quantity = newQuantity;
    } else {
      user.holdings.push({ symbol: stock.symbol, name: stock.name, quantity, averagePrice: stock.currentPrice });
    }
  }

  if (type === 'sell') {
    const holding = user.holdings.find((h) => h.symbol === stock.symbol);
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient holdings' });
    }

    holding.quantity -= quantity;
    user.balance = Number((user.balance + total).toFixed(2));
    if (holding.quantity === 0) {
      user.holdings = user.holdings.filter((h) => h.symbol !== stock.symbol);
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await user.save({ session });
    const [order] = await Order.create(
      [
        {
          user: user._id,
          symbol: stock.symbol,
          stockName: stock.name,
          type,
          quantity,
          price: stock.currentPrice,
          total,
          status: 'completed'
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const freshUser = await User.findById(user._id).select('-password');
    return res.status(201).json({ message: 'Order placed', order, user: freshUser });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: 'Order failed', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getPortfolio = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  const marketStocks = await Stock.find({ symbol: { $in: user.holdings.map((h) => h.symbol) } });

  const portfolio = user.holdings.map((holding) => {
    const market = marketStocks.find((m) => m.symbol === holding.symbol);
    const currentValue = Number(((market?.currentPrice || 0) * holding.quantity).toFixed(2));
    const investedValue = Number((holding.averagePrice * holding.quantity).toFixed(2));
    return {
      ...holding.toObject(),
      currentPrice: market?.currentPrice || 0,
      currentValue,
      investedValue,
      pnl: Number((currentValue - investedValue).toFixed(2))
    };
  });

  res.json({
    balance: user.balance,
    holdings: portfolio,
    totalInvested: portfolio.reduce((acc, item) => acc + item.investedValue, 0),
    totalCurrent: portfolio.reduce((acc, item) => acc + item.currentValue, 0)
  });
};
