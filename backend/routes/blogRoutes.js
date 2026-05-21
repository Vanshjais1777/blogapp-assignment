import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Optional Auth Middleware for public getBlogs to allow admins to see drafts if requested
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore error for optional auth
    }
  }
  next();
};

router.route('/')
  .get(optionalAuth, getBlogs)
  .post(protect, authorizeRoles('Super Admin', 'Editor', 'Author'), createBlog);

router.route('/:slug')
  .get(getBlogBySlug);

router.route('/:id')
  .put(protect, authorizeRoles('Super Admin', 'Editor', 'Author'), updateBlog)
  .delete(protect, authorizeRoles('Super Admin', 'Editor', 'Author'), deleteBlog);

export default router;
