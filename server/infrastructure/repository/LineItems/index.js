'use strict';

const LineItems = require('../../../domain/lineItems');
const BaseRepository = require('../BaseRepository');

class LineItemsRepository extends BaseRepository {
  constructor() {
    super();
    this.model = this.db.models.lineitems;
  }

  async readById(id) {
    const lineItems = await this.model.findOne({ 
      where: {
      fileId: id
    }, 
    raw: true 
  });
    return new LineItems(lineItems);
  }

  async create(data) {
    const lineItem = await this.model.create(data);
    return new LineItems(lineItem);
  }

  async delete(id) {
    return this.model.destroy({ 
        where: {
        fileId: Number(id)
      }, 
    });
  }
}

module.exports = LineItemsRepository;
