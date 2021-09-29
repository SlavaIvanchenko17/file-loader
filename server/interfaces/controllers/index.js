'use strict';

const fs = require('fs');
const { promisify } = require('util');
const repositories = require('../../infrastructure/repository');
const service = require('../../application');

const unlinkAsync = promisify(fs.unlink);

const uploadFile = async (req, res) => {
  try {
    const result = await service.createFile(req.files, repositories);
    result.json('upload file(s)');
  } catch (error) {
    console.error(error);
    res.send('upload error');
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await service.getFileById(req.params.id, repositories);
    const path = `${__dirname}../../../../${file.path}`;
    res.download(path);
  } catch (error) {
    console.error(error);
    res.send('download error');
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await service.getFileById(req.params.id, repositories);
    await service.deleteFile(req.params.id, repositories);
    const { path } = file;
    return unlinkAsync(path);
  } catch (error) {
    console.error(error);
    res.send('delete error');
  }
};

const getFiles = async (req, res) => {
  try {
    const result = await service.getFiles(repositories);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.send('Not found');
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  getFiles,
};
