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
		tasks: [{type:mongoose.Schema.Types.Mixed, ref: 'Task'}],
		subjects: [{type:mongoose.Schema.Types.Mixed, ref: 'Subject'}],
		grades: [{type:mongoose.Schema.Types.Mixed, ref: 'Grade'}],
		events: [{type:mongoose.Schema.Types.Mixed, ref: 'Event'}],
		messages: [{type:mongoose.Schema.Types.Mixed, ref: 'Message'}],
		userClasses: [{type:mongoose.Schema.Types.Mixed, ref: 'Class'}]
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);