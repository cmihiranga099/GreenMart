import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/productController';
import { auth } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';
import upload from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Admin routes
router.post('/', auth, roleCheck(['admin']), upload.array('images', 5), createProduct);
router.put('/:id', auth, roleCheck(['admin']), upload.array('images', 5), updateProduct);
router.delete('/:id', auth, roleCheck(['admin']), deleteProduct);
router.patch('/:id/stock', auth, roleCheck(['admin']), updateStock);

export default router;
