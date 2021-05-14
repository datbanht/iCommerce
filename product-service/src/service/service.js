const express = require('express');
const createError = require('http-errors');
const models = require('../models');

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
    /* eslint-disable no-await-in-loop */
    for (const item of aData) {
      const exists = await productModel.exists({ name: item.name });
      log.debug(`${JSON.stringify(item)} -> ${exists}`)
      if (!exists) {
        filteredData.push(item);
      }
    }
    /* eslint-enable no-await-in-loop */
    const result = await productModel.insertMany(filteredData);
    log.debug(`The products have been inserted into DB -> ${JSON.stringify(filteredData)}...`)
    return result;

  });

  service.delete('/products', async (req, res, next) => {
    if (!req.body) {
      return next(createError(404, 'Input not found'));
    }
    const a = req.body;
    const promises = [];
    for (const item of a) {
      const deletePromise = productModel.deleteMany(item);
      promises.push(deletePromise);
    }
    const final = await Promise.all(promises);
   
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
