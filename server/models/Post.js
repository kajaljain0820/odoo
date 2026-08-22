import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  activity_or_place: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'posts',
  timestamps: true
});

export default Post;
