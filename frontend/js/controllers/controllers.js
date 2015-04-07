'use strict';
function IndexCtrl($scope, $http) {
	$scope.posts = [];
    $http.get('http://localhost:3000/api/posts').then(function(response){
        $scope.posts = response.data.reverse();
    });
};

function PostsCtrl($scope, $http, $routeParams) {
	$scope.post = [];
	$scope.id =  $routeParams.id;
	console.log($scope.id);
	$scope.load = false;
	$http.get('http://localhost:3000/api/posts/' + $scope.id).then(function(response){
        $scope.post = response.data.post;
        $scope.load = true;
    });
};

function NewPostCtrl($scope, $http) {
	$scope.inProcess = false;
	$scope.newPost = function () {
		$scope.inProcess = true;
		console.log($scope.params);
		$http.post('/api/posts/new', $scope.params)
			.success(function (data, status, headers, config) {
				$scope.inProcess = false;
				console.log('Data: ' + data);
				console.log('Status: ' + status);
				console.log('Headers: ' + headers);
				console.log('Config: ' + config);
				console.log('Success!');
				$scope.params = {};
			})
			.error(function(data, status, headers, config) {
				$scope.inProcess = false;
		  	});
	};
};
function AboutCtrl($scope, $http, $routeParams) {
};


// function IndexCtrl($scope, $http) {
// 	$scope.result = {}
// 	$scope.res = $http.get('/api/posts/').then(function(res){
//       $scope.result = res.data;
//   });

// 	$scope.submit = function () {
// 		params = {
// 			title: $scope.title,
// 			author: $scope.author,
// 			description: $scope.description,
// 		}
// 		console.table(params);
// 		$http.post('/api/posts/', params).
// 		  success(function(data, status, headers, config) {
// 		    // this callback will be called asynchronously
// 		    // when the response is available
// 		  }).
// 		  error(function(data, status, headers, config) {
// 		    // called asynchronously if an error occurs
// 		    // or server returns response with an error status.
// 		  });
// 	}

// }
