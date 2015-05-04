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
router.get('/getcookie', function (req, res) {
	if (req.cookies) {
	    res.send(req.cookies);
	  } else {
	    res.send('<form method="post"><p>Check to <label>'
	      + '<input type="checkbox" name="remember"/> remember me</label> '
	      + '<input type="submit" value="Submit"/>.</p></form>');
	  }
});
router.post('/setcookie', function (req, res) {
	var minute = 60 * 1000;
	if (req.param('key')) res.cookie('remember', 1, { maxAge: minute });
	res.redirect('back');
});
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
            //find client cookie in redis storage
   			//client.get(req.params.key, function (error, val) {
			// 	if (error !== null) console.log("error: " + error);
			// 	else {
			// 		res.send("The value for this key is " + val);
			// 	}
			// });

            hash_key = crypto.createHash('md5').update('Apple').digest("hex");
            res.cookie('redis', hash_key);
            res.statusCode = 400;
   //          client.set(hash_key, user, function (error, result) {
			// 	if (error !== null) console.log("error: " + error);
			// 	else {
			// 		res.send("The value for '" + hash_key + "' is set to: " + user.username);
			// 	}
			// });
        });
    });
    // UserModel.findOne({username:username}, function (err, user) {
    //     if (err) {
    //         log.info(err);
    //         return  res.send(401);
    //     };

    //     user.comparePassword(password, function (isMatch) {
    //         if (!isMatch) {
    //             log.info("Attempt failed to login with " + user.username);
    //             return res.send(401);
    //         }

    //         // var token = jwt.sign({username: user.username}, 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx', { expiresInMinutes: 60 });
 
    //         // return res.json({token:token});
    //     });
    // });
});

function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/sessions/new');
      }
    });
  } else {
    res.redirect('/sessions/new');
  }
}

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
