'use strict';

const File = require('../../domain/File');
const LineItems = require('../../domain/lineItems');
const XLSX = require('xlsx');
const { getJsDateFromExcel } = require("excel-date-to-js");

module.exports = async (data, { FileRepository, LineItemsRepository }) => {
  data.forEach((item) => {
    const { originalname, path } = item;
    const date = new Date().getTime();
    const extension = originalname.split('.').pop();
    const filename = originalname.split('.').shift();
    const file = new File({
      filename, extension, date, path,
    });
    if(extension !== 'csv'){
      FileRepository.create(file);
    } else {
      const json = {};
      const headers = [];
      let rows = [];
      FileRepository.create(file)
      .then(res => {
        const workbook = XLSX.readFile(path);  
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
        for(let i = 0; i < data.length; i++){
          if(data.length <= 1){
            return LineItemsRepository.create(new LineItems({fileId: res.id, items: {}, status: 0}));
          }
          if(i === 0){
            data[i].forEach(val => {
              const header = val.split('').filter(symbol => symbol !== '*').join('');
              headers.push({
                "id": header.toLowerCase(),
                "name": header
              });
            });
          } else {
            const row = {};
            data[i].forEach((item, index) => {
                if(headers[index].id === 'date') {
                  row[headers[index].id] = {
                    "type": 'string',
                    "value": getJsDateFromExcel(item)
                  }
                } else {
                  row[headers[index].id] = {
                    "type": typeof item,
                    "value": item
                  }
                }
            });
            rows.push(row);
            if(i === data.length - 1){
              json["headers"] = headers;
              json["row"] = rows;
              LineItemsRepository.create(new LineItems({fileId: res.id, items: JSON.stringify(json), status: 1}));
            }
          };
        }
      })
    }
  });
};
