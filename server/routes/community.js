import express from 'express';
import { createPost, getPosts } from '../controllers/communityController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getPosts);
router.post('/', authenticate, createPost);

export default router;
