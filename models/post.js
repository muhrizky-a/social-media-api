'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user');

const Posts = db.define('posts', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  user_id: {
    allowNull: false,
    references: {
      model: {
        tableName: 'users'
      },
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    type: DataTypes.INTEGER,
  },
  contents: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: {
      notEmpty: true,
    }
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: {
      notEmpty: true,
    }
  }
}, {
  modelName: 'Wisata',
});

User.hasMany(Posts, {
  foreignKey: 'user_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Posts.belongsTo(User);

module.exports = Posts;