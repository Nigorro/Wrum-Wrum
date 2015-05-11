'use strict';
app.controller('IndexCtrl', ['$scope', '$http',
	function IndexCtrl($scope, $http) {
		$scope.posts = [];
	    $http.get('/api/posts').then(function(response){
	        $scope.posts = response.data.reverse();
	    });
	}
]);

app.controller('PostsCtrl', ['$scope', '$http', '$routeParams',
	function PostsCtrl($scope, $http, $routeParams) {
		$scope.post = [];
		$scope.id =  $routeParams.id;
		console.log($scope.id);
		$scope.load = false;
		$http.get('/api/posts/' + $scope.id).then(function(response){
	        $scope.post = response.data.post;
	        $scope.load = true;
	    });
	}
]);

app.controller('NewPostCtrl', ['$scope', '$http', '$upload', 
	function NewPostCtrl($scope, $http, $upload) {
		$scope.inProcess = false;
		$scope.params = {};
		//

		$scope.$watch('files', function () {
	        $scope.upload($scope.files);
	    });

	    $scope.upload = function (files) {
	        if (files && files.length) {
	            for (var i = 0; i < files.length; i++) {
	                var file = files[i];
	                $upload.upload({
	                    url: '/api/upload',
	                    fields: {
	                        'username': $scope.username
	                    },
	                    file: file
	                }).progress(function (evt) {
	                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                    console.log('progress: ' + progressPercentage + '% ' +
	                                evt.config.file.name);
	                }).success(function (data, status, headers, config) {
	                    console.log('file ' + config.file.name + 'uploaded. Response: ' +
	                                JSON.stringify(data.path));
	                    $scope.params.image = 'post_photos/' + data.path;
	                });
	            }
	        }
	    };

		//

		$scope.newPost = function () {
			console.log($scope.params);
			$http.post('/api/posts', $scope.params)
				.success(function (data, status, headers, config) {
					$scope.inProcess = false;
					console.log('Data: ' + data);
					console.log('Status: ' + status);
					console.log('Headers: ' + headers);
					console.log('Config: ' + config);
					console.log('Success!');
					$scope.inProcess = true;
					$scope.params = {};
				})
				.error(function(data, status, headers, config) {
					$scope.inProcess = false;
			  	});
		};
	}
]);

app.controller('AcceptCtrl', ['$scope', '$http',
	function AcceptCtrl($scope, $http) {
		$scope.posts = [];
	    $http.get('/api/posts').then(function(response){
	        $scope.posts = response.data.reverse();
	    });
	    
		$scope.accept = function (id) {
			console.log(id);
			$http.put('/api/posts/' + id + '/accept').success(function (status) {
				console.log('OK: ' +status);
			})
			.error(function(status) {
				console.log('ERROR: ' +status);
		  	});
		}
	}
]);

app.controller('AboutCtrl', ['$scope', '$http', 
	function AboutCtrl($scope, $http) {
		$scope.login = {};
		$scope.logIn = function () {
			console.log('bingo!');
			$http.post('/api/login', $scope.login)
				.success(function (data, status, headers, config) {
					$scope.inProcess = false;
					console.log('Data: ' + data);
					console.log('Status: ' + status);
					console.log('Headers: ' + headers);
					console.log('Config: ' + config);
					console.log('Success!');
					$scope.inProcess = true;
					$scope.params = {};
				})
				.error(function(data, status, headers, config) {
					$scope.inProcess = false;
			  	});
		};
	}
]);

