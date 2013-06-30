angular.module('myApp').
controller('WelcomeController', function($scope, ApiService) {
		// listen to events
		ApiService.subscribe('users-list', function (users) {
			$scope.userProvider.users = users;
		});

		$scope.login = function () {
			ApiService.emit('connect-user', $scope.name);
		};



	}
);