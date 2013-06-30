
// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui.ace'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/main', {templateUrl: 'partials/main.tpl.html', controller: 'mainCtrl'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
    
    $routeProvider.when('/', {templateUrl: 'partials/welcome.html', controller: 'WelcomeController'});
    $routeProvider.when('/room', {templateUrl: 'partials/room.html', controller: 'MainController'});

    // $routeProvider.otherwise({redirectTo: '/main'});
  }]);
