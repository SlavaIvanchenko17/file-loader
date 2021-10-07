'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LineItems extends Model {
    static associate(models) {
        LineItems.belongsTo(models.file, {
          foreignKey: 'fileId',
        });
      }
  }
  LineItems.init(
    {
      fileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      items: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'lineitems',
    },
  );
  return LineItems;
};
