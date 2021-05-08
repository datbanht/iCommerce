const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
	name: String,
	price: Number,
	branch: String,
	color: String
});

module.exports = mongoose.model('Product', ProductSchema)