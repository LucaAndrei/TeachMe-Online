var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
	message : String,
	user : { type : mongoose.Schema.Types.ObjectId, ref : 'User'}
});

module.exports = mongoose.model('Message', messageSchema);