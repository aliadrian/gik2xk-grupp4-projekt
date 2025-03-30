require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "your-password",
    database: process.env.DB_NAME || "shop_db",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: console.log,
  },
};
