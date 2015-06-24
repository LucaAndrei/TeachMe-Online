var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
	title : String,
	start : String,
	end : String,
	descriere : String,
	user : { type : mongoose.Schema.Types.ObjectId, ref : 'User'}
});

module.exports = mongoose.model('Event', eventSchema);