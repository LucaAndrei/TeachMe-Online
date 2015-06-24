var mongoose = require('mongoose');

var subjectSchema = mongoose.Schema({
	subject_name : String,
	user : { type : mongoose.Schema.Types.ObjectId, ref : 'User'}
});

module.exports = mongoose.model('Subject', subjectSchema);