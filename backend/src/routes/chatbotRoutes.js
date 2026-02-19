import { Router } from 'express';
import { body } from 'express-validator';
import { askAssistant } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/', protect, [body('query').isLength({ min: 2 }), validate], askAssistant);

export default router;
