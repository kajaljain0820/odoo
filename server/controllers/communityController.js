import { Post, User } from '../models/index.js';
import { Op } from 'sequelize';

// Create a community post
export const createPost = async (req, res) => {
  try {
    const { content, activity_or_place } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    const newPost = await Post.create({
      content,
      activity_or_place: activity_or_place || null,
      userId
    });

    const fullPost = await Post.findByPk(newPost.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'first_name', 'last_name', 'photo_url']
      }]
    });

    res.status(201).json(fullPost);
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

// Get community feed
export const getPosts = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { content: { [Op.like]: `%${search}%` } },
        { activity_or_place: { [Op.like]: `%${search}%` } }
      ];
    }

    const posts = await Post.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'first_name', 'last_name', 'photo_url']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ message: 'Server error fetching feed' });
  }
};
