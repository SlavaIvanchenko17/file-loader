'use strict';

class File {
  constructor(data) {
    const {
      id = null, fileId, items, status
    } = data;
    this.id = id;
    this.fileId = fileId;
    this.items = items;
    this.status = status;
  }
}

module.exports = File;
