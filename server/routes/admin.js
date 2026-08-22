import express from 'express';
import { getUsersList, deleteUser, toggleAdminStatus, getAnalytics } from '../controllers/adminController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', authenticate, adminOnly, getUsersList);
router.delete('/users/:id', authenticate, adminOnly, deleteUser);
router.put('/users/:id/toggle-admin', authenticate, adminOnly, toggleAdminStatus);
router.get('/analytics', authenticate, adminOnly, getAnalytics);

export default router;
