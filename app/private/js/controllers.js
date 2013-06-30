'use strict';

/* Controllers */

angular.module('myApp')


.controller('mainCtrl', ["$scope", "ApiService", "appState" , function($scope, ApiService, appState) {

  	$scope.editorContent = "Stam";

  	$scope.$watch("editorContent", function(newValue, oldValue){
  		if (!newValue) newValue = "";
  		if (newValue !== oldValue){

  			$scope.save();
  		}
  	})
//  	if (!appState.user.isAdmin){
  		ApiService.subscribe("texteditor", function(data){
	  		console.log(data)
	  		if (data !== $scope.editorContent){
	  			$scope.$apply(function(){

					$scope.editorContent = data;  		
	  			})
	  		}
	  	})
  	// }
  	

  	$scope.save = function () {
  		ApiService.emit("texteditor", $scope.editorContent)
  	}

  }])





  .controller('MyCtrl2', [function() {

  }]);