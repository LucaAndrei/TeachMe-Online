var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
	_id : String,
	numeTest : String,
	registeredUsers: [
		{
			idUser : String,
			incercari : Number,
			lastAccessed : String
		}

	]
});

module.exports = mongoose.model('Task', taskSchema);