const mongoose = require('mongoose');

const DB_URL = 'mongodb://admin:admin@localhost:27017/my-mongo-db';
mongoose.connect(DB_URL, 
  {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => console.log(`DB Error Connection: ${err.reason}`));
mongoose.connection.on("open", (err) => {
  if (err) throw err;
  console.log("The DB Connection now has been opened...")
});
mongoose.connection.on("close", (err) => {
  if (err) throw err;
  console.log("The DB Connection now has been closed...")
});

module.exports.Product = require('./Product');
