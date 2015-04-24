var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSessionSchema = mongoose.Schema({
		user : { type : mongoose.Schema.Types.ObjectId, ref : 'User'},
		SessionStart : String,
		SessionEnd : String,
		SessionCookie : String
});
module.exports = mongoose.model('UserSession', userSessionSchema);