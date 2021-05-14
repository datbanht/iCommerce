const express = require('express');
const models = require('../models');
const helper = require('../common/helper')

const productModel = models.product;
const service = express();

module.exports = config => {
  const log = config.log();

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

   /**
   * /products?<fieldName>=<operator>:<fieldValue>
   * /products?name=name1
   * /products?name=eq:name1
   * /products?price=gte:10
   */
  service.get('/products', async (req, res, next) => {
    try {
      let result = null;
      if (!req.query) {
        result = await productModel.find().exec();
      } else {
        const conditions = helper.buildQuery(req.query);
        const sortFields = helper.buildSort(req.query);        
        const query = productModel.find(conditions);
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
