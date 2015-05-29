'use strict';
var loginController = function($scope, $http, $state, $rootScope, $timeout) {
    $scope.error_login = false;
    $scope.sendAuth = function() {
        var user = {
            pass: $scope.password,
            email: $scope.email
        };
        if ($scope.password == "" || $scope.password == undefined) {
            $("#password").attr("placeholder", "*Introduceti parola")
            $scope.error_password = true;
        } else {
            $("#password").attr("placeholder", "Parola")
            $scope.error_password = false;
        }
        if ($scope.email == "" || $scope.email == undefined) {
            $("#email").attr("placeholder", "*Introduceti e-mail-ul")
            $scope.error_email = true;
        } else {
            $("#email").attr("placeholder", "E-mail")
            $scope.error_email = false;
        }
        if ($scope.error_password == false && $scope.error_email == false) {
            $http.post('/login', user).success(function(data) {

                    $scope.error_login = false;

                    userCredentials = data;
                    $rootScope.userCredentials = userCredentials;

                    if (userCredentials.tipUser == "teacher") {
                        $state.go('account_prof');
                    } else {
                        $state.go('account_elev');
                    }
                }).error(function() {
                    $scope.error_login = true;
                });
        }
    }
}

var signUpController = function($scope, $http, $state, $rootScope, $timeout) {
    $scope.error_register = false;
    $scope.error_register_email = false;
    $scope.sendSignUp = function() {
        if ($scope.password == "" || $scope.password == undefined) {
            $("#password").attr("placeholder", "*Introduceti parola")
            $scope.error_password = true;
        } else {
            $("#password").attr("placeholder", "Parola")
            $scope.error_password = false;
        }
        if ($scope.email == "" || $scope.email == undefined) {
            $("#email").attr("placeholder", "*Introduceti e-mail-ul")
            $scope.error_email = true;
        } else {
            $("#email").attr("placeholder", "E-mail")
            $scope.error_email = false;
        }
        if ($scope.nume == "" || $scope.nume == undefined) {
            $("#nume").attr("placeholder", "*Introduceti numele")
            $scope.error_nume = true;
        } else {
            $("#nume").attr("placeholder", "Nume")
            $scope.error_nume = false;
        }
        if ($scope.prenume == "" || $scope.prenume == undefined) {
            $("#prenume").attr("placeholder", "*Introduceti prenumele")
            $scope.error_prenume = true;
        } else {
            $("#prenume").attr("placeholder", "Prenume")
            $scope.error_prenume = false;
        }

        if ($scope.error_password == false && $scope.error_email == false &&
            $scope.error_nume == false && $scope.error_prenume == false) {

            var user = {
                pass: $scope.password,
                email: $scope.email,
                nume: $scope.nume,
                prenume: $scope.prenume,
                facultate: $scope.facultate
            };
            if (document.getElementById("tipUser").checked) {
                user.tipUser = "teacher";
            } else {
                user.tipUser = "student";
            }

            $http.post('/signup', user).success(function(data) {
                $scope.error_register_email = false;

                userCredentials = data;
                $rootScope.userCredentials = userCredentials;

                if (userCredentials.tipUser == "teacher") {
                    $state.go('account_prof');
                } else {
                    $state.go('account_elev');
                }
            }).error(function() {
                $scope.error_register = true;
            });
        }
    }
}