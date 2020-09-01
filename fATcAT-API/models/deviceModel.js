const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
	deviceID:{
		type: String,
		require: [true, 'Device must has an ID'],
	},
	bowls: Array,
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;