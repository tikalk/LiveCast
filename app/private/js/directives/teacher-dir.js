'use strict';

angular.module('myApp.directives', []).
  directive('teacherAvatar', function() {
      return {
        restrict: "E",
        templateUrl: "partials/teacher.html",
        link: function(scope, element, attrs) {
          scope.sayTeacher = function() {
            alert("TEACHER!!!");
          } 
        }
      }
  });