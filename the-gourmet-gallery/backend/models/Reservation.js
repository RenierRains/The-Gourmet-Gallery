const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Reservation = sequelize.define('Reservation', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'completed', 'canceled']],
    },
  },
});

// relationships
Reservation.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

User.hasMany(Reservation, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

module.exports = Reservation;