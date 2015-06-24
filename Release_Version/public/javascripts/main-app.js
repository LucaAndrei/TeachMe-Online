angular.module('main_app', ['ui.router', 'account_prof', 'account_elev']).
    config(function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider
            .state('root', {
                url: "/",
                abstract: true,
                templateUrl: "modules/Home/Templates/Home.html",
                controller: function($state, $rootScope) {
                    $state.go("root.mainpage")
                },
                resolve: {}
            })
            .state('root.mainpage', {
                url: "main",
                templateUrl: "modules/Home/Templates/MainPage.html",
                controller: mainControler,
                resolve: {
                    userLoggedIn: function($http, $state, $rootScope) {
                        return $http.get("/cookie").success(function(data) {
                            if (data != null && data != "") {
                                userCredentials = data;
                                $rootScope.userCredentials = userCredentials;
                                if (data.tipUser == "teacher") {
                                    $state.go('account_prof.dashboard');
                                } else {

                                    $state.go('account_elev.dashboard');
                                }
                            } else {
                                userCredentials = null;
                                $rootScope.userCredentials = null;
                            }
                        })
                    }
                }
            })
            .state('root.login', {
                url: "login",
                templateUrl: "modules/Authentication/Templates/SignIn.html",
                controller: loginController,
                resolve: {
                    userLoggedIn: function($http, $state, $rootScope) {
                        return $http.get("/cookie").success(function(data) {
                            if (data != null && data != "") {
                                userCredentials = data;
                                $rootScope.userCredentials = userCredentials;
                                if (data.tipUser == "teacher") {
                                    $state.go('account_prof.dashboard');
                                } else {

                                    $state.go('account_elev.dashboard');
                                }
                            } else {
                                userCredentials = null;
                                $rootScope.userCredentials = null;
                            }
                        })
                    }
                }
            })
            .state('root.signup', {
                url: "signup",
                templateUrl: "modules/Authentication/Templates/SignUp.html",
                controller: signUpController,
                resolve: {
                    userLoggedIn: function($http, $state, $rootScope) {
                        return $http.get("/cookie").success(function(data) {
                            if (data != null && data != "") {
                                userCredentials = data;
                                $rootScope.userCredentials = userCredentials;
                                if (data.tipUser == "teacher") {
                                    $state.go('account_prof.dashboard');
                                } else {

                                    $state.go('account_elev.dashboard');
                                }
                            } else {
                                userCredentials = null;
                                $rootScope.userCredentials = null;
                            }
                        })
                    }
                }
            });
        $urlRouterProvider.otherwise('/main');

    }).config(["$locationProvider", function($locationProvider) {}]).run(function($rootScope, $http, $state) {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (error.status == "404") {
                $state.go("root.mainpage")
            }
        });
    });