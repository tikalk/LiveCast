angular.module('myApp').
controller('MainController', ["$scope", "ApiService", "appState",
	function($scope, ApiService, appState) {
		// listen to events
		ApiService.subscribe('users-list', function (users) {
			$scope.userProvider.users = users;
		});

		APIService.subscribe('joined', function (isAdmin, users, chat, canvas) {
			$location.hash("/room");
			appState.user.isAdmin = isAdmin;
		});

		$scope.usersProvider = {
			getUsers:  function() {
				return ApiService.emit('users-list');
			}
		};



	}
]);