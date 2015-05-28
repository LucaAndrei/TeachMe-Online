var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
		nume : String,
		prenume : String,
		email : String,
		password : String,
		facultate : String,
		tipUser : String,
		imgPath : String,
		isOnline : false,
		loggedInChat : false,
		grades: [{type:mongoose.Schema.Types.Mixed, ref: 'Grade'}],
		events: [{type:mongoose.Schema.Types.Mixed, ref: 'Event'}]
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);