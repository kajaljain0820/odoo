import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  day_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  activity_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expense: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'activities',
  timestamps: true
});

export default Activity;
