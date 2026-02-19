import { Router } from 'express';
import { getStockAnalytics, getStockBySymbol, getStocks } from '../controllers/stockController.js';

const router = Router();

router.get('/', getStocks);
router.get('/:symbol', getStockBySymbol);
router.get('/:symbol/analytics', getStockAnalytics);

export default router;
