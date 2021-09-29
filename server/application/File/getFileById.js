'use strict';

module.exports = (id, { FileRepository }) => FileRepository.readById(id);