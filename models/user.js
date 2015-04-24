var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
		nume : String,
		prenume : String,
		email : String,
		password : String,
		facultate : String,
		tipUser : String,
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
	console.log("valid password : " + password)
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.assignTask = function(task,cb) {
	console.log("userschema assigntask:cb "  + cb)
	console.log("userschema assigntask:task "  + task)
  	this.tasks.push(task);
  	this.save(cb);
};

module.exports = mongoose.model('User', userSchema);