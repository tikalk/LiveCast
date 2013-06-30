angular.module('myApp.controllers', []).
controller('MainController', [
	function($scope, APIService) {
		// listen to events
		APIService.subscribe('users-list', function (users) {
			$scope.userProvider.users = users;
		});

		// APIService.subscribe('joined', function (isAdmin, users, chat, canvas) {
		// 	if (!isAdmin) {
		// 		if (users) {
					
		// 		}
		// 	}
		// });

		$scope.usersProvider = {
			getUsers:  function() {
				return APIService.emit('users-list');
			}
		};



	}
]);