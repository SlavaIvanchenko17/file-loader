'use strict';

const File = require('../../../domain/File');
const BaseRepository = require('../BaseRepository');

class FileRepository extends BaseRepository {
  constructor() {
    super();
    this.model = this.db.models.file;
  }

  async read() {
    const files = await this.model.findAll({ raw: true });
    return files.map((file) => new File(file));
  }

  async readById(id) {
    const file = await this.model.findByPk(id, { raw: true });
    return new File(file);
  }

  async create(data) {
    const file = await this.model.create(data);
    return new File(file);
  }

  async delete(id) {
    return this.model.destroy({
      where: { id },
    });
  }
}

module.exports = FileRepository;
