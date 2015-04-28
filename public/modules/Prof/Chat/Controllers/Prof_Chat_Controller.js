'use strict';
var prof_chat_controller = function($scope, $http, $state, $rootScope, $timeout, promise, online_users_promise) {
    console.log("prof_chat_controller.js : ", userCredentials);
    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = promise.data;
    var online_users = [];
    for (var i = 0; i < promise.data.length; i++) {
        console.log("promise data isonline : " + promise.data[i].isOnline)
    }
    $scope.online_users = online_users;
    if ($scope.users.length > 0) {
        $scope.emptyList = false;
    } else if ($scope.users.length == 0) {
        $scope.emptyList = true;
    }

}