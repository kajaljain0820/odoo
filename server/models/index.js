import sequelize from '../config/database.js';
import User from './User.js';
import Trip from './Trip.js';
import ItinerarySection from './ItinerarySection.js';
import Activity from './Activity.js';
import Post from './Post.js';

// Setup relationships
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Trip.hasMany(ItinerarySection, { foreignKey: 'tripId', as: 'sections', onDelete: 'CASCADE' });
ItinerarySection.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

Trip.hasMany(Activity, { foreignKey: 'tripId', as: 'activities', onDelete: 'CASCADE' });
Activity.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

export {
  sequelize,
  User,
  Trip,
  ItinerarySection,
  Activity,
  Post
};
