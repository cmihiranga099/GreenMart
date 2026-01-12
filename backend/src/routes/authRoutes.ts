import express from 'express';
import { register, login, logout, getMe, updateMe } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

export default router;
