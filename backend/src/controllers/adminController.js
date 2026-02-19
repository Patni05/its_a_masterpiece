import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Order from '../models/Order.js';

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const createStock = async (req, res) => {
  const stock = await Stock.create(req.body);
  res.status(201).json(stock);
};

export const updateStock = async (req, res) => {
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!stock) return res.status(404).json({ message: 'Stock not found' });
  res.json(stock);
};

export const getPlatformAnalytics = async (req, res) => {
  const [userCount, orderCount, stockCount] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Stock.countDocuments()
  ]);

  const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
  const tradedVolume = orders.reduce((acc, order) => acc + order.total, 0);

  res.json({ userCount, orderCount, stockCount, tradedVolume });
};
