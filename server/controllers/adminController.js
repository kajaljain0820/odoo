import { User, Trip, Activity, Post, sequelize } from '../models/index.js';

// Get list of users (Admin only)
export const getUsersList = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'first_name', 'last_name', 'email', 'phone', 'city', 'is_admin', 'createdAt'],
      include: [{
        model: Trip,
        as: 'trips',
        attributes: ['id']
      }]
    });

    const formattedUsers = users.map(u => {
      const userObj = u.get({ plain: true });
      return {
        ...userObj,
        tripCount: userObj.trips.length
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle user admin status (Admin only)
export const toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot revoke your own admin rights' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.is_admin = !user.is_admin;
    await user.save();

    res.json({ message: 'Admin status updated successfully', user: { id: user.id, username: user.username, is_admin: user.is_admin } });
  } catch (error) {
    console.error('Error updating admin status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Analytics data (Admin only)
export const getAnalytics = async (req, res) => {
  try {
    // 1. General counts
    const totalUsers = await User.count();
    const totalTrips = await Trip.count();
    const totalPosts = await Post.count();

    // 2. Popular Cities (most visited destinations)
    const popularCities = await Trip.findAll({
      attributes: [
        ['destination_place', 'name'],
        [sequelize.fn('COUNT', sequelize.col('destination_place')), 'tripCount']
      ],
      group: ['destination_place'],
      order: [[sequelize.literal('tripCount'), 'DESC']],
      limit: 5
    });

    // 3. Popular Activities
    const popularActivities = await Activity.findAll({
      attributes: [
        ['activity_name', 'name'],
        [sequelize.fn('COUNT', sequelize.col('activity_name')), 'count']
      ],
      group: ['activity_name'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 5
    });

    // 4. Monthly User Registrations Trend (Last 6 months)
    const userTrends = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.literal('month'), 'ASC']],
      limit: 6
    });

    // 5. Monthly Trip Bookings Trend
    const tripTrends = await Trip.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.literal('month'), 'ASC']],
      limit: 6
    });

    res.json({
      counts: {
        users: totalUsers,
        trips: totalTrips,
        posts: totalPosts
      },
      popularCities,
      popularActivities,
      userTrends,
      tripTrends
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ message: 'Server error generating analytics', error: error.message });
  }
};
