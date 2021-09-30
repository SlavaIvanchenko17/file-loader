'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const controller = require('../controllers');

const app = express();
const router = express.Router();

app.use(cors());
app.use(morgan('dev'));

const fileUpload = multer({
  dest: `${__dirname}/files`,
});

router.get('/file', controller.getFiles);
router.get('/file/:id', controller.downloadFile);
router.post('/file', express.json(), fileUpload.array('file'), controller.uploadFile);
router.delete('/file/:id', controller.deleteFile);

app.use(router);

app.listen(8000, () => {
  console.log('app is running');
});
