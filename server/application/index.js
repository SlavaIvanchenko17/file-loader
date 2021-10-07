'use strict';

const fs = require('fs');
const path = require('path');

const loadServices = (service) => {
  const services = {};
  const servicePath = path.join(__dirname, `./${service}`);
  const files = fs.readdirSync(servicePath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(servicePath, fileName);
    const serviceName = path.basename(fileName, '.js');
    services[serviceName] = require(filePath);
  }
  return services;
};

module.exports = {
  ...loadServices('File'),
  ...loadServices('LineItems'),
};
