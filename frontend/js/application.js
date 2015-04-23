var app = angular.module('wrum', ['ngRoute', 'ngResource', 'angularFileUpload'])

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'templates/index.html',
			controller: 'IndexCtrl',
			access: { requiredLogin: false }
		})
		.when('/post/:id', {
			templateUrl: 'templates/post.html',
			controller: 'PostsCtrl',
			access: { requiredLogin: false }
		})
		.when('/about', {
			templateUrl: 'templates/about.html',
			controller: 'AdminUserCtrl',
			access: { requiredLogin: false }
		})
		.when('/newpost/', {
			templateUrl: 'templates/new.html',
			controller: 'NewPostCtrl',
			access: { requiredLogin: true }
		})
		.when('/accept/', {
			templateUrl: 'templates/accept.html',
			controller: 'AcceptCtrl',
			access: { requiredLogin: true }
		})
		.otherwise({
			redirectTo: '/',
		});
	$locationProvider.html5Mode(true);
}]);
app.run(function ($rootScope, $location, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
            $location.path("/about");
        }
    });
});