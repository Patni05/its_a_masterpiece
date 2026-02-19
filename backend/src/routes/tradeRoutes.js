import { Router } from 'express';
import { body } from 'express-validator';
import { getOrders, getPortfolio, placeOrder } from '../controllers/tradeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);
router.get('/portfolio', getPortfolio);
router.get('/orders', getOrders);
router.post('/orders', [body('symbol').notEmpty(), body('type').isIn(['buy', 'sell']), body('quantity').isInt({ min: 1 }), validate], placeOrder);

export default router;
