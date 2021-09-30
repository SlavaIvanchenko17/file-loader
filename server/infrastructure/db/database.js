'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

class Database {
  constructor() {
    this.sequelize = new Sequelize(
      'file_loader',
      'slava',
      '12345',
      {
        host: 'localhost',
        dialect: 'postgres',
      },
    );
    this.sequelize.sync({ force: false }).then(() => {
      console.log('Database synced');
    });
    this.models = {};
    this.loadModels();
  }

  loadModels() {
    const modelsPath = path.join(__dirname, '/models');
    const files = fs.readdirSync(modelsPath);
    for (const fileName of files) {
      if (!fileName.endsWith('.js')) continue;
      const model = require(path.join(modelsPath, fileName))(
        this.sequelize,
        Sequelize.DataTypes,
      );
      this.models[model.name] = model;
    }

    Object.keys(this.models).forEach((modelName) => {
      if (this.models[modelName].associate) {
        this.models[modelName].associate(this.models);
      }
    });
  }
}

module.exports = Database;
