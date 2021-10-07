'use strict';

module.exports = (id, { LineItemsRepository }) => LineItemsRepository.readById(id);