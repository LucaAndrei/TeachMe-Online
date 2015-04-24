var mongoose = require('mongoose');

var gradeSchema = mongoose.Schema({
	name : String,
	nota : Number,
	data : String,
	user : { type : mongoose.Schema.Types.ObjectId, ref : 'User'}
});

module.exports = mongoose.model('Grade', gradeSchema);