var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
	subject : String,
	credite : Number,
	tipExam : String,
	room : String,
	day : String,
	start_time : String,
	end_time : String,
	teacher : String,
	descriere : String,
	user : { type : mongoose.Schema.Types.ObjectId, ref : 'User'},
	registeredUsers: [{ type : mongoose.Schema.Types.ObjectId, ref : 'User'}]
});

module.exports = mongoose.model('Class', classSchema);