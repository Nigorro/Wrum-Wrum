var express = require('express');
var redis = require('redis');
var UserModel = require('../models/UserModel').UserModel;
var log = require('../libs/log')(module);
var crypto = require('crypto');

var router = express.Router();


var client = redis.createClient();//CREATE REDIS CLIENT
var app = express();



//
//Redis
//

//GET KEY'S VALUE
router.get('/redis/get/:key', function(req, response) {
	client.get(req.params.key, function (error, val) {
		if (error !== null) console.log("error: " + error);
		else {
			response.send("The value for this key is " + val);
		}
	});
});
 
//SET KEY'S VALUE
router.get('/redis/set/:key/:value', function(req, response) {
	client.set(req.params.key, req.params.value, function (error, result) {
		if (error !== null) console.log("error: " + error);
		else {
			response.send("The value for '"+req.params.key+"' is set to: " + req.params.value);
		}
	});
});


///
/// LOGIN
///
router.post('/login', function (req, res) {
    var username = req.param('username') || '';
    var password = req.param('password') || '';
    console.log(req.cookies);

    if (username == '' || password == '') {
        return res.send(401);
    }
    UserModel.findOne({username:username}, function (err, user) {
    	 if (err) {
            log.info(err);
            return  res.send(401);
        };
        user.comparePassword(password, function (isMatch) {
            if (!isMatch) {
                log.info("Attempt failed to login with " + user.username);
                return res.send(401);
            }
            hash_key = crypto.createHash('md5').update('Apple').digest("hex");
            var death = 2628000000; 
            res.cookie('userKey', hash_key, { maxAge: death });

   			client.set(hash_key, user._id, function (error, result) {
				if (error !== null) console.log("error: " + error);
				else {
					console.log("The value for '" + hash_key + "' is set to: " + user._id);
					return res.send(user._id);
				}
			});
        });
    });

});

router.post('/singin', function (req, res) {
    var user = new UserModel({
        username: req.param('username'),
        password: req.param('password')
    });

    user.save( function (err) {
        if (!err) {
            return res.send({ status: 'OK'});
        } else {
        if(err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
          } else {
              res.statusCode = 500;
              res.send({ error: 'Server error' });
          }
          log.error('Internal error(%d): %s',res.statusCode,err.message); 
        }
    })
});


router.get('/users', function (req, res) {
    return UserModel.find(function (err, users) {
        if(!err) {
            return res.send(users);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    })
});


module.exports = router;
