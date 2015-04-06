'use strict';
function IndexCtrl($scope, $http) {
	$scope.posts = [];
    $http.get('http://localhost:3000/api/posts').then(function(response){
        $scope.posts = response.data;
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
function AboutCtrl($scope, $http, $routeParams) {

}
