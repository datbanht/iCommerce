const express = require('express');
const createError = require('http-errors');
const models = require('../models');
const helper = require('../common/helper');

const paymentModel = models.payment;
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

  /**
  * /payments?<fieldName>=<operator>:<fieldValue>
  */
  service.get('/payments', async (req, res, next) => {
    try {
      let result = null;
      if (!req.query) {
        result = await paymentModel.find().exec();
      } else {
        const conditions = helper.buildQuery(req.query);
        const sortFields = helper.buildSort(req.query);
        const query = paymentModel.find(conditions);
        if (sortFields) {
          query.sort(sortFields);
        }
        result = await query.exec();
      }
      return res.json(result);

    } catch (err) {
      return next(err);
    }
  });

  service.delete('/payments', async (req, res, next) => {
    if (!req.body) {
      return next(createError(404, 'Input not found'));
    }
    const a = req.body;
    const promises = [];
    for (const item of a) {
      const deletePromise = paymentModel.deleteMany(item);
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
