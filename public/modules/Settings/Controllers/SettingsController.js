'use strict';
var settings_controller = function($scope, $http, $state, $rootScope, $timeout) {
    $scope.userCredentials = userCredentials;
    $scope.error_numeUpdate = false;
    $scope.error_prenumeUpdate = false;
    $scope.error_emailUpdate = false;
    $scope.updateProfile = function() {
        if ($('#numeUpdate').val() == "") {
            $scope.error_numeUpdate = true;
        } else {
            $scope.error_numeUpdate = false;
        }
        if ($('#prenumeUpdate').val() == "") {
            $scope.error_prenumeUpdate = true;
        } else {
            $scope.error_prenumeUpdate = false;
        }
        if ($('#emailUpdate').val() == "") {
            $scope.error_emailUpdate = true;
        } else {
            $scope.error_emailUpdate = false;
        }
        if (($('#numeUpdate').val() != "") && ($('#prenumeUpdate').val() != "") && ($('#emailUpdate').val() != "")) {
            var updatedUser = {
                nume: $('#numeUpdate').val(),
                prenume: $('#prenumeUpdate').val(),
                email: $('#emailUpdate').val()
            }
            $http.put('/api/users/updateUser', updatedUser).success(function(data) {
                $("#msg-correct").css("display", "block");
                setTimeout(function() {
                    $("#msg-correct").css("display", "none");
                }, 2000)
            })
        }
    }
}