'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {}
  File.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      extension: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'file',
    },
  );
  return File;
};
