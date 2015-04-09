var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Post = new Schema({
	author: { type: String, required: false },
	description: { type: String, required: true },
	carNumber: {type: String, required: false},
	image: {type: String, required: true},
	date: { type: Date, default: Date.now },
	isAccepted: { type: Boolean, default: false},
	votes: [],
	asshole: {},
});

var Vote = new Schema([

]);

var PostModel = mongoose.model('Post', Post);

module.exports.PostModel = PostModel;