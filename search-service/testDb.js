const mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@localhost:27017/my-mongo-db', 
  {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => console.log(`------------Error: ${err.reason}`));
mongoose.connection.on("open", (err, conn) => {
  if (err) throw err;
  console.log("Connection now has been opened...")
});
mongoose.connection.on("close", (err, conn) => {
  console.log("Connection now has been closed...")
  process.exit();
});

const ProductModel = require('./src/models/Product');

// ProductModel.insertMany([{
//   name: "name1",
// 	price: 2,
// 	branch: "Branch Test",
// 	color: "Testing"
// },{
// 	name: "name3",
// 	price: 1,
// 	branch: "Branch 3",
// 	color: "Color 3"
// },{
// 	name: "name 3",
// 	price: 1,
// 	branch: "Branch 3",
// 	color: "Color 3"
// },{
// 	name: "name 4",
// 	price: 1,
// 	branch: "Branch 4",
// 	color: "Color 4"
// },{
// 	name: "name 5",
// 	price: 1,
// 	branch: "Branch 5",
// 	color: "Color 5"
// }]);


// ProductModel.insertMany([{
//     name: "name11",
//   	price: 2,
//   	branch: "Branch Test",
//   	color: "Testing"
//   },{
//   	name: "name33",
//   	price: 1,
//   	branch: "Branch 3",
//   	color: "Color 3"
//   },{
//   	name: "name 333",
//   	price: 1,
//   	branch: "Branch 333",
//   	color: "Color 3"
//   },{
//   	name: "name 44455",
//   	price: 1,
//   	branch: "Branch 44455",
//   	color: "Color 44455"
//   },{
//   	name: "name 5666",
//   	price: 1,
//   	branch: "Branch 5666",
//   	color: "Color 5666"
//   }]);

// const fetchData = async () => {
//   result = await ProductModel.find({ name: 'name 4' });
//   return result
// };
// const products = fetchData();
// console.log(JSON.stringify(products));

// ProductModel.find({ name: 'name 4' }, (error, data) => {
//   console.log(`Result: ${data}`)
// });

// const fetchAll = async () => {
//   try {
//     const p = await ProductModel.find({ name: 'name 4' }).exec();
//     // console.log(p);
//     return p;
//   } catch(e) {
//     return e;
//   }
// };

// fetchAll().then((result) => {
//   console.log(result);
//   process.exit();
// }).catch((e) => console.error(e));


const conds = {};

// fieldName
// const fieldName = "name"
// const fieldValue = new RegExp('name1', 'i');
// // const fieldValue = "name1"
// // const fieldValue = {"$eq": "name1"};
// conds[fieldName] = fieldValue;

// // cond["price"] =  {"$gte": 2};
// const query = ProductModel.find(conds);

// // condition = {fieldName: 'price', fieldValue: '2', operator: 'e'}
// // operator: gt, gte, lt, lte, eq, 
// const conds = {};
// // fieldName
// const fieldName = "name"
// const fieldValue = new RegExp('name1', 'i');
// // const fieldValue = "name1"
// // const fieldValue = {"$eq": "name1"};
// conds[fieldName] = fieldValue;

// // cond["price"] =  {"$gte": 2};
const query = ProductModel.find(conds);
// // const query = ProductModel.find({name: 'name1'});

// sort
// const sortFields = {};
// sortFields["price"] = 1;
// // sortFields["name"] = -1;

// query.sort(sortFields);
query.sort('price');
query.exec().then((result) => {
  console.log(result);
  process.exit();
}).catch(e => {
  console.log(e);
  process.exit();
});