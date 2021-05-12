const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: String,
	price: Number,
	branch: String,
	color: String
});

module.exports = mongoose.model('Product', productSchema)