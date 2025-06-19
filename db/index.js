const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5000;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const Whiteboard = sequelize.define("Whiteboard", {
  roomId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  drawingData: {
    type: DataTypes.TEXT, 
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully.");
    await sequelize.sync();
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
  }
})();

module.exports = { sequelize, Whiteboard };
