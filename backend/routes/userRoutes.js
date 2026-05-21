import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorizeRoles('Super Admin'), getUsers);

router
  .route('/:id')
  .put(protect, authorizeRoles('Super Admin'), updateUser)
  .delete(protect, authorizeRoles('Super Admin'), deleteUser);

export default router;
