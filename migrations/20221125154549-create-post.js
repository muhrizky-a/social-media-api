'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.INTEGER,
      },
      contents: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        validate: {
          notEmpty: true,
        }
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        validate: {
          notEmpty: true,
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};