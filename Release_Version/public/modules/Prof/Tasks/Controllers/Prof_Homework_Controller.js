'use strict';
var prof_homework_controller = function($scope, $http, $state, $rootScope, $timeout, users) {
    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = users.data;
    if ($scope.users.length > 0) {
        $scope.emptyList = false;
    } else if ($scope.users.length == 0) {
        $scope.emptyList = true;
    }
}