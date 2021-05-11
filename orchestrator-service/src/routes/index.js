const express = require('express');
const SearchService = require('../services/Search');
const config = require('../config')[process.env.NODE_ENV || 'development'];

const router = express.Router();
const searchService = new SearchService(config);

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
      const result = await searchService.getProducts(req.url);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  });
  
  return router;
};
