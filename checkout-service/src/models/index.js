const mongoose = require('mongoose');

const config = require('../config')[process.env.NODE_ENV || 'development'];

const log = config.log();

const DB_URL = 'mongodb://admin:admin@localhost:27017/my-mongo-db';
mongoose.connect(DB_URL, 
  {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => log.error(`DB Error Connection: ${err.reason}`));
mongoose.connection.on("open", (err) => {
  if (err) throw err;
  log.info("The DB Connection now has been opened...")
});
mongoose.connection.on("close", (err) => {
  if (err) throw err;
  log.info("The DB Connection now has been closed...")
});

module.exports.payment = require('./payment');
