var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

//user shema 

var User = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

User.pre('save', function (next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(11, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
	        if (err) return next(err);
	        user.password = hash;
	        next();
	    });
	});
});

//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

var UserModel = mongoose.model('User', User);

module.exports.UserModel = UserModel;