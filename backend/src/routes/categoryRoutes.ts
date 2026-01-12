import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { auth } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';
import upload from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', auth, roleCheck(['admin']), upload.single('image'), createCategory);
router.put('/:id', auth, roleCheck(['admin']), upload.single('image'), updateCategory);
router.delete('/:id', auth, roleCheck(['admin']), deleteCategory);

export default router;
