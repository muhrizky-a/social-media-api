'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');

const User = db.define('users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  modelName: 'users',
});

module.exports = User;