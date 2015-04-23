var express = require('express');
var fs = require('fs');
var multiparty = require('multiparty');
var bodyParser = require('body-parser');
var PostModel = require('../models/postModel').PostModel;

var UserModel = require('../models/UserModel').UserModel;
var jwt = require('express-jwt');

var log = require('../libs/log')(module);
var Asshole = require('../models/asshole').Asshole;

var router = express.Router();

var app = express();
app.use(bodyParser.json())

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

router.post('/posts', function (req, res) {
	var post = new PostModel({
		author: req.param('author'),
		description: req.param('description'),
        car_number: req.param('car_number'),
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

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/api/upload' enctype='multipart/form-data'>" +
"<input type='file' name='image'/>" +
"<input type='submit' /></form>" +
"</body></html>";

router.get('/file', function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html' });
  res.end(form);

});
router.post('/upload', function (req, res) {
    var form = new multiparty.Form();
    //здесь будет храниться путь с загружаемому файлу, его тип и размер
    var uploadFile = {uploadPath: '', type: '', size: 0};
    //максимальный размер файла
    var maxSize = 2 * 10240 * 10240; //2MB
    //поддерживаемые типы(в данном случае это картинки формата jpeg,jpg и png)
    var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    //массив с ошибками произошедшими в ходе загрузки файла
    var errors = [];

     //если произошла ошибка
    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            //если загружаемый файл существует удаляем его
            fs.unlinkSync(uploadFile.path);
            console.log('error');
        }
    });

    form.on('close', function() {
        //если нет ошибок и все хорошо
        if(errors.length == 0) {
            //сообщаем что все хорошо
            res.send({status: 'ok', text: 'Success', path: this.newName});
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                //если загружаемый файл существует удаляем его
                fs.unlinkSync(uploadFile.path);
            }
            //сообщаем что все плохо и какие произошли ошибки
            res.send({status: 'bad', errors: errors});
        }
    });

    // при поступление файла
    form.on('part', function(part) {
        //читаем его размер в байтах
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла

        var min = 1,
            max = 10000000,
            random = 0;
        random = parseInt(Math.random() * (max - min) + min);
        var saveName = random;
        this.newName = saveName + part.filename;
        uploadFile.path = './frontend/post_photos/'+ this.newName;

        //проверяем размер файла, он не должен быть больше максимального размера
        if(uploadFile.size > maxSize) {
            errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        }

        //проверяем является ли тип поддерживаемым
        if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push('Unsupported mimetype ' + uploadFile.type);
        }

        //если нет ошибок то создаем поток для записи файла
        if(errors.length == 0) {
            console.log(uploadFile.path);
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    });

    // парсим форму
    form.parse(req);
});

router.delete('/posts/:id', function(req, res, next) {
  return PostModel.findById(req.params.id, function (err, post) {
    if(!post) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    return post.remove(function (err) {
      if (!err) {
        log.info("post removed");
        return res.send({ status: 'OK'});
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  });
});

router.put('/posts/:id/accept', function (req, res){
    return PostModel.findById(req.params.id, function (err, post) {
        if(!post) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        post.isAccepted = true;
        return post.save(function (err) {
            if (!err) {
                log.info("post updated");
                return res.send({ status: 'OK', post:post });
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
        });
    });
});

///
/// LOGIN
///
router.post('/login', function (req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    console.log(username + '   ' + password);

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

            var token = jwt.sign({username: user.username}, 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx', { expiresInMinutes: 60 });
 
            return res.json({token:token});
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