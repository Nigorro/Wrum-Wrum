var app = angular.module('wrum', ['ngRoute', 'ngResource'])

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'templates/index.html',
			controller: IndexCtrl,
		})
		.when('/post/:id', {
			templateUrl: 'templates/post.html',
			controller: PostsCtrl,
		})
		.when('/about', {
			templateUrl: 'templates/about.html',
			controller: AboutCtrl,
		})
		.otherwise({
			redirectTo: '/',
		})
}]);