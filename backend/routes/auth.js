import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.requestPasswordReset);

// Protected Routes
router.get('/preferences', authMiddleware, authController.getCurrentUser);

export default router;