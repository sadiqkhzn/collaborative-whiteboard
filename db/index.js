const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: "../../.env" }); // Adjust path as needed

const PORT = process.env.PORT || 5000;

// Sequelize connection (example for PostgreSQL)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

// Define the Whiteboard model
const Whiteboard = sequelize.define("Whiteboard", {
  roomId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  drawingData: {
    type: DataTypes.TEXT, // Storing base64 image or JSON
  },
});

// Test connection & sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully.");
    await sequelize.sync(); // Creates table if it doesn't exist
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
  }
})();

module.exports = { sequelize, Whiteboard };
