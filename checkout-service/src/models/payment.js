const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
	userName: String,
	orderId: String,
	productName: String,
	quality: Number,
	price: Number
});

module.exports = mongoose.model('Payment', paymentSchema)