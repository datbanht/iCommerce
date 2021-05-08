const express = require('express');
const models = require('../models');

const productModel = models.Product;
const service = express();

module.exports = (config) => {
  const log = config.log();

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  const isDigit = n => !Number.isNaN(Number(n));

  const buildQuery = (query) => {
    const q = {...query};
    if ('sort_by' in q) {
      delete q.sort_by;
    }

    Object.keys(q).forEach((key) => {
      if (key in q) {
        let fieldValue = {};
        const a = q[key].split(":");
        let value = "";
        let ops = "";
        if (a.length > 1) {
          [ops, value] = a
          fieldValue[`$${ops}`] = isDigit(value) ? parseInt(value, 10) : value;
        } else {
          value = isDigit(a[0]) ? parseInt(a[0], 10) : a[0];
          fieldValue = new RegExp(value, 'i');
        }
        q[key] = fieldValue;
      }
    });

    return q;
  };

  const buildSort = (query) => {
    const sortBy = query.sort_by;
    if (!sortBy) {
      return null;
    }
    
    let sortFields = [];
    sortFields = sortBy.split(/[,]/);
    sortFields = sortFields.map((field) => field.trim());
    return sortFields.join(" ");
  };

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
        const conditions = buildQuery(req.query);
        const sortFields = buildSort(req.query);        
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
