var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Post = new Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	description: { type: String, required: true },
	carNumber: {type: String, required: true},
	image: {type: String, required: true},
	date: { type: Date, default: Date.now },
	votes: [],
	asshole: {},
});

var Vote = new Schema([

]);

var PostModel = mongoose.model('Post', Post);

module.exports.PostModel = PostModel;