import { Router } from 'express';
import { body } from 'express-validator';
import { forgotPassword, login, me, resetPassword, signup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/signup', [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), validate], signup);
router.post('/login', [body('email').isEmail(), body('password').notEmpty(), validate], login);
router.post('/forgot-password', [body('email').isEmail(), validate], forgotPassword);
router.post('/reset-password', [body('token').notEmpty(), body('newPassword').isLength({ min: 6 }), validate], resetPassword);
router.get('/me', protect, me);

export default router;
