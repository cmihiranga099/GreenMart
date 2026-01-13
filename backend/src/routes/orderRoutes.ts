import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  addTrackingUpdate,
} from '../controllers/orderController';
import { auth } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Admin routes - must come BEFORE parameterized routes
router.get('/all/list', roleCheck(['admin']), getAllOrders);
router.patch('/:id/status', roleCheck(['admin']), updateOrderStatus);
router.post('/:id/tracking', roleCheck(['admin']), addTrackingUpdate);

// Customer routes
router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id/cancel', cancelOrder);
router.get('/:id', getOrderById);

export default router;
