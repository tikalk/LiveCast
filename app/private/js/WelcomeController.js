angular.module('myApp.controllers', []).
controller('WelcomeController', [
	function($scope, APIService) {
		// listen to events
		APIService.subscribe('users-list', function (users) {
			$scope.userProvider.users = users;
		});

		$scope.login = function () {
			APIService.emit('connect-user', $scope.name);
		};



	}
]);