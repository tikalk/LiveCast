angular.module('myApp').
controller('MainController', [
	function($scope, ApiService) {
		// listen to events
		ApiService.subscribe('users-list', function (users) {
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
				return ApiService.emit('users-list');
			}
		};



	}
]);