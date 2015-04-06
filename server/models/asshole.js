var mongoose = require('mongoose'); 

var Schema = mongoose.Schema;

var Asshole = new Schema({
	number: {type: String, required: true},
	postId: [],
	rating: {type: Number},
});


var AssholeModel = mongoose.model('Asshole', Asshole);

module.exports.AssholeModel = AssholeModel;