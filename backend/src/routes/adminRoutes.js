import { Router } from 'express';
import { body } from 'express-validator';
import {
  createStock,
  getPlatformAnalytics,
  getUsers,
  updateStock,
  updateUserRole
} from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.patch('/users/:id/role', [body('role').isIn(['user', 'admin']), validate], updateUserRole);
router.post('/stocks', [body('symbol').notEmpty(), body('name').notEmpty(), body('currentPrice').isFloat({ min: 1 }), validate], createStock);
router.patch('/stocks/:id', updateStock);
router.get('/analytics', getPlatformAnalytics);

export default router;
