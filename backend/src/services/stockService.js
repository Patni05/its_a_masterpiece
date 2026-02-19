import axios from 'axios';
import Stock from '../models/Stock.js';
import StockHistory from '../models/StockHistory.js';
import { getIO } from '../config/socket.js';

const fallbackUniverse = [
  { symbol: 'TATA', name: 'Tata Group', sector: 'Conglomerate', currentPrice: 186.2 },
  { symbol: 'JIO', name: 'Jio Platforms', sector: 'Telecom', currentPrice: 117.4 },
  { symbol: 'INFY', name: 'Infosys', sector: 'Technology', currentPrice: 74.1 },
  { symbol: 'RELI', name: 'Reliance Industries', sector: 'Energy', currentPrice: 122.7 }
];

export const bootstrapStocks = async () => {
  const count = await Stock.countDocuments();
  if (count > 0) return;
  await Stock.insertMany(fallbackUniverse);
};

const randomWalk = (price) => {
  const volatility = Math.random() * 2.5;
  const direction = Math.random() > 0.5 ? 1 : -1;
  const nextPrice = Math.max(1, price + direction * volatility);
  return Number(nextPrice.toFixed(2));
};

export const syncStockPrices = async () => {
  const stocks = await Stock.find({ isActive: true });

  for (const stock of stocks) {
    let nextPrice = randomWalk(stock.currentPrice);
    let source = 'simulated';

    if (process.env.STOCK_API_URL && process.env.STOCK_API_KEY) {
      try {
        const response = await axios.get(process.env.STOCK_API_URL, {
          params: {
            symbol: stock.symbol,
            token: process.env.STOCK_API_KEY
          },
          timeout: 6000
        });

        if (response.data?.price) {
          nextPrice = Number(response.data.price);
          source = 'external_api';
        }
      } catch (error) {
        // fallback to simulation when API is unavailable
      }
    }

    stock.change = Number((nextPrice - stock.currentPrice).toFixed(2));
    stock.currentPrice = nextPrice;
    stock.volume = stock.volume + Math.floor(Math.random() * 5000);
    await stock.save();

    const history = await StockHistory.create({
      symbol: stock.symbol,
      price: stock.currentPrice,
      volume: stock.volume,
      source
    });

    const io = getIO();
    if (io) {
      io.emit('stock:update', {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.currentPrice,
        change: stock.change,
        volume: stock.volume,
        timestamp: history.timestamp
      });
    }
  }
};
