const express = require('express');
const SearchService = require('../services/searchService');
const CheckoutService = require('../services/checkoutService');
const ProductService = require('../services/productService');
const CheckoutProducer = require('../common/checkoutProducer');
const config = require('../config')[process.env.NODE_ENV || 'development'];
const createError = require('http-errors');

const log = config.log();
const router = express.Router();
const searchService = new SearchService(config);
const checkoutService = new CheckoutService(config);
const productService = new ProductService(config);
const checkoutProducer = new CheckoutProducer();
checkoutProducer.connect()
  .then(() => log.info(`The Message MQ has been connected...`))
  .catch((error) => log.error(`Error in connecting to Message MQ: ${error.message}`));

module.exports = () => {

  router.get('/', async (req, res, next) => {
    try {
      return res.json("Hello, welcome to orchestrator service");
    } catch (err) {
      return next(err);
    }
  });

  router.get('/products', async (req, res, next) => {
    try {
      const config = { url: req.url };
      const result = await searchService.getProducts(config);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  });

  router.post('/products', async (req, res, next) => {
    if (!req.body) {
      return next(createError(404, 'Input not found'));
    }

    try {
      const config = { url: req.url, data: req.body };
      const result = await productService.insertProducts(config);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  });
  
  router.delete('/products', async (req, res, next) => {
    if (!req.body) {
      return next(createError(404, 'Input not found'));
    }

    try {
      const config = { url: req.url, data: req.body };
      const result = await productService.deleteProducts(config);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  });

  router.post('/checkout', async (req, res, next) => {
    if (!req.body) {
      return next(createError(404, 'Input not found'));
    }

    try {
      const result = checkoutProducer.send(req.body);
      if (result) {
        msg = "The data has been sent to Message MQ...";
        log.info(msg)
        return res.json(msg);
      }
    } catch (err) {
      return next(err);
    }
  });

  router.get('/payments', async (req, res, next) => {
    try {
      const config = { url: req.url };
      const result = await checkoutService.getPayments(config);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  });

  router.delete('/payments', async (req, res, next) => {
    if (!req.body) {
      return next(createError(404, 'Input not found'));
    }

    try {
      const config = { url: req.url, data: req.body };
      const result = await checkoutService.deletePayments(config);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
