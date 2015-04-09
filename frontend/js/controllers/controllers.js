'use strict';
function IndexCtrl($scope, $http) {
	$scope.posts = [];
    $http.get('/api/posts').then(function(response){
        $scope.posts = response.data.reverse();
    });
};

function PostsCtrl($scope, $http, $routeParams) {
	$scope.post = [];
	$scope.id =  $routeParams.id;
	console.log($scope.id);
	$scope.load = false;
	$http.get('/api/posts/' + $scope.id).then(function(response){
        $scope.post = response.data.post;
        $scope.load = true;
    });
};

function NewPostCtrl($scope, $http) {
	$scope.inProcess = false;
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
				$scope.params = {};
				$scope.inProcess = true;
			})
			.error(function(data, status, headers, config) {
				$scope.inProcess = false;
		  	});
	};
};

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

function AboutCtrl($scope, $http, $routeParams) {
};

