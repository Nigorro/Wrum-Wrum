var express = require('express');
var router = express.Router();
var PostModel = require('../models/postModel').PostModel;
var log = require('../libs/log')(module);
var Asshole = require('../models/asshole').Asshole;


/* GET All Post listing. */
router.get('/posts', function(req, res, next) {
  return PostModel.find(function (err, posts) {
    if (!err) {
        return res.send(posts);
    } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
    }
	});
});

router.get('/posts/:id', function(req, res, next) {
  return PostModel.findById(req.params.id, function (err, post) {
    if(!post) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    if (!err) {
      return res.send({ status: 'OK', post:post });
    } else {
      res.statusCode = 500;
      return res.send({ error: 'Server error' });
    }
  });
});

router.post('/posts/new', function (req, res) {
	var post = new PostModel({
		title: req.param('title'),
		author: req.param('author'),
		description: req.param('description'),
		image: req.param('image'),
	});

	post.save(function (err) {
		if (!err) {
			return res.send({ status: 'OK', post:post });
		} else {
      console.log(err);
      if(err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
      } else {
          res.statusCode = 500;
          res.send({ error: 'Server error' });
      }
      log.error('Internal error(%d): %s',res.statusCode,err.message);
    }
	});
});

module.exports = router;