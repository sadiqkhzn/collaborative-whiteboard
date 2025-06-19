const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Whiteboard = sequelize.define("Whiteboard", {
    roomId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    drawingData: {
      type: DataTypes.TEXT, // stores base64 image or JSON
    },
  });

  return Whiteboard;
};
