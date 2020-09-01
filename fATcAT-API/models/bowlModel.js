const mongoose = require('mongoose');

const bowlschema = new mongoose.Schema({
	key:{
		type: String,
		require: [true, 'Bowl must has a key'],
		unique: true
	},
	activeHours: String,
});

const bowls = mongoose.model('Bowl', bowlschema);

module.exports = bowls;