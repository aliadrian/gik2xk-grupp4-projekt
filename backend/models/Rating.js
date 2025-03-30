const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define("Rating", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

(async () => {
  await Rating.sync({ alter: true });
  console.log("Rating table synced!");
})();

module.exports = Rating;
