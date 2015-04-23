app.factory('Post', function ($http, $q) {
	var apiUrl = 'http://localhost:3000/api/';

	var PostModel = function (data) {
		if (data) {
			this.setData(data);
		};
	}

	PostModel.prototype.setData = function (data) {
		angular.extend(this, data);
	};

	PostModel.prototype.delete = function () {
		$http.delete(apiUrl + '/posts/' + this._id).success(function() {
			console.log('Delete Post: ' + this._id)
		}).error(function (data, status, headers, config) {
			console.log('ERROR! Cant delete Post: ' + this._id)
		}); 
	};

	PostModel.prototype.create = function () {
		$http.post(apiUrl + '/posts/', this).success(function(r) {
			console.log('Create post!')
    }).error(function(data, status, headers, config) {
    	console.log('Cant create post!')
    });
	};

	var post = {
		getAll: function () {
			var deferred = $q.defer();
	    var scope = this;
	    var posts = [];
	    $http.get(apiUrl + '/posts').success(function(array) {
	      array.forEach(function(data) {
	        posts.push(new PostModel(data));
	      });
	      deferred.resolve(posts);
	    }).error(function() {
	      deferred.reject();
	    });
	    return deferred.promise;
		},
		getOne: function () {
			var deferred = $q.defer();
      var scope = this;
      var data = {};
      $http.get(apiUrl + '/posts/' + id).success(function(data) {
        deferred.resolve(new PostModel(data));
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
		},

		createEmpty: function () {
			return new PostModel({});
		}
	};

	return post;
});



app.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }
 
    return auth;
});

app.factory('UserService', function($http) {
    return {
        logIn: function(username, password) {
            return $http.post('api/login', {username: username, password: password});
        },
 
        logOut: function() {
 
        }
    }
});

app.factory('TokenInterceptor', function ($q, $window, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
 
        response: function (response) {
            return response || $q.when(response);
        }
    };
});

app.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
 
        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },
 
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/about");
            }
 
            return $q.reject(rejection);
        }
    };
});