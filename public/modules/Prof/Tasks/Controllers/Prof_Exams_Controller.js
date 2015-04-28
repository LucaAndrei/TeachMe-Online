'use strict';
var prof_exams_controller = function($scope, $http, $state, $rootScope, $timeout, promise) {
    //console.log("prof_exams_controller.js : ",userCredentials);
    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = promise.data;
    if ($scope.users.length > 0) {
        $scope.emptyList = false;
    } else if ($scope.users.length == 0) {
        $scope.emptyList = true;
    }
}