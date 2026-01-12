import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { auth } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';

const router = express.Router();

// Admin routes - all require admin role
router.use(auth);
router.use(roleCheck(['admin']));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
