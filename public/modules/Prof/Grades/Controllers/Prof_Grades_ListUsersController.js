'use strict';
var prof_grades_list_users_controller = function($scope, $http, $state, $rootScope, $timeout, promise) {
    //console.log("dashboardProfController.js : ", userCredentials);
    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = promise.data;
    if ($scope.users.length > 0) {
        $scope.emptyList = false;
    } else if ($scope.users.length == 0) {
        $scope.emptyList = true;
    }


    var timestamp = userCredentials._id.toString().substring(0, 8);
    var date = new Date(parseInt(timestamp, 16) * 1000);
}