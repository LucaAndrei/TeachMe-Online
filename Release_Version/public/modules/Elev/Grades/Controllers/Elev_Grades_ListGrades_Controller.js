'use strict';
var elev_grades_list_grades_controller = function($scope, $http, $state, $rootScope, $timeout, grades) {
    $scope.userCredentials = userCredentials;
    $scope.emptyList = null;

    $scope.sortType     = 'name'; // set the default sort type
  	$scope.sortReverse  = false;  // set the default sort order
  	$scope.searchFish   = '';     // set the default search/filter term

    if (grades.data.length > 0) {
        $scope.emptyList = false;
        $scope.grades = grades.data;
    } else if (grades.data.length == 0) {
        $scope.emptyList = true;
    }
}