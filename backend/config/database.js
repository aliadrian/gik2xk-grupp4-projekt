const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "shop_db",
  process.env.DB_USER || "root",
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MariaDB with Sequelize");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
})();

module.exports = sequelize;
