const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
	name:{
		type: String,
		require: [true, 'Cat must has a name'],
	},
	sex:{
		type: String,
		require: [true, 'Cat must has a sex'],
	},
	weight:{
		type: Number,
		require: [true, 'Cat must has a weight'],
	},
	bowlID:{
		type: String,
		require: [true, 'Cat must connect to a bowl'],
	},
	feedingHours:{
		type: String,
		require: [true, 'Cat must has feeding hours'],
	},
});

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;