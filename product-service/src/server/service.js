const express = require('express');
const models = require('../models');
const createError = require('http-errors');

const productModel = models.product;
const service = express();
service.use(express.static('public'));
service.use(express.json());
service.use(express.urlencoded({ extended: true }));
service.get('/favicon.ico', (req, res) => res.sendStatus(204));

module.exports = (config) => {
  const log = config.log();

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.post('/products', async (req, res, next) => {
    if (!req.body) {
      return next(createError(404, 'Input not found'));
    }
    const aData = req.body;
    const filteredData = [];
    for(let item of aData) {
      const exists = await productModel.exists({ name: item.name });
      log.debug(`${JSON.stringify(item)} -> ${exists}`)
      if (!exists) {
        filteredData.push(item);
      }
    }

    const result = await productModel.insertMany(filteredData);
    log.debug(`The products have been inserted into DB -> ${JSON.stringify(filteredData)}...`)
    return result;

  });

  service.delete('/products', async (req, res, next) => {
    if (!req.body) {
      return next(createError(404, 'Input not found'));
    }
    const a = req.body;
    const final = [];
    for(let item of a) {
      const result = await productModel.deleteMany(item);
      final.push(result);
    }
   
    return res.json(final);
  });

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });

  return service;
};
