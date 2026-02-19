import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { bootstrapStocks, syncStockPrices } from './services/stockService.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await bootstrapStocks();

  const server = http.createServer(app);
  initSocket(server);

  setInterval(async () => {
    await syncStockPrices();
  }, Number(process.env.STOCK_SYNC_INTERVAL_MS || 12000));

  server.listen(PORT, () => {
    console.log(`Tradex API running on port ${PORT}`);
  });
};

start();
