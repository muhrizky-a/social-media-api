const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        timezone: "+08:00"
    },
    timezone: "+08:00",
    define: {
        timestamps: false,
        underscored: true
    }
});

module.exports = db;