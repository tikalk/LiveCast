
// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/welcome.html', controller: 'WelcomeController'});
    $routeProvider.when('/room', {templateUrl: 'partials/room.html', controller: 'Users/MainController'});

    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
