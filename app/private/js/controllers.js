'use strict';

/* Controllers */

angular.module('myApp')


.controller('mainCtrl', ["$scope", "ApiService" , function($scope, ApiService) {

  	$scope.editorContent = "Stam";

  	ApiService.subscribe("texteditor", function(data){
  		console.log(data)
  		if (data !== $scope.editorContent){
			$scope.editorContent = data;  		
  		}
  	})

  	$scope.save = function () {
  		ApiService.emit("texteditor", $scope.editorContent)
  	}

  }])





  .controller('MyCtrl2', [function() {

  }]);