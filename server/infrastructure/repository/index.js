'use strict';

const FileRepository = require('./File');
const LineItemsRepository = require('./LineItems');

module.exports = {
  FileRepository: new FileRepository(),
  LineItemsRepository: new LineItemsRepository()
};
