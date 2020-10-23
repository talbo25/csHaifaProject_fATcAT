const mongoose = require('mongoose');

const bowlschema = new mongoose.Schema({
	// Never hold the plain-text key in your DB hash it by Bcrypt if it's a key for compare only,
	// otherwise, after I "hacked" to your DB I do have the literal keys of all you bowls and I can login as any bowl I want, and this is SAD.  
	key:{
		type: String,
		require: [true, 'Bowl must has a key'],
		unique: true
	},
	activeHours: String,
	method: String,
	bowlID:{
		type: Number,
		require: [true, 'Bowl must has a factory id number'],
		unique: true
	},	
});

const bowls = mongoose.model('Bowl', bowlschema);

module.exports = bowls;