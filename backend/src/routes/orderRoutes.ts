import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController';
import { auth } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';

const router = express.Router();

// Customer routes
router.use(auth);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/cancel', cancelOrder);

// Admin routes
router.get('/all/list', roleCheck(['admin']), getAllOrders);
router.patch('/:id/status', roleCheck(['admin']), updateOrderStatus);

export default router;
