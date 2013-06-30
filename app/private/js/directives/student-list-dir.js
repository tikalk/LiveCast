'use strict';

angular.module('myApp.directives', []).
  directive('studentList', function() {
  		return {
  			restrict: "E",
  			templateUrl: "partials/students.html",
  			link: function(scope, element, attrs) {
  				scope.sayBa = function() {
  					alert("baaaaaa");
  				}	
  			}
  		}
  });

