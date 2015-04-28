'use strict';
var elev_grades_list_grades_controller = function($scope, $http, $state, $rootScope, $timeout, grades) {
    //console.log("gradesElevController.js : ",userCredentials);
    $scope.userCredentials = userCredentials;
    $scope.emptyList = null;
    if (grades.data.length > 0) {
        $scope.emptyList = false;
        $scope.grades = grades.data;
    } else if (grades.data.length == 0) {
        $scope.emptyList = true;
    }
}