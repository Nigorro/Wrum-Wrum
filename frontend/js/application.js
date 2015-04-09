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
		.when('/newpost/', {
			templateUrl: 'templates/new.html',
			controller: NewPostCtrl,
		})
		.when('/accept/', {
			templateUrl: 'templates/accept.html',
			controller: AcceptCtrl,
		})
		.otherwise({
			redirectTo: '/',
		})
}]);