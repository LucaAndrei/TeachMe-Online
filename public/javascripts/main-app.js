var DEBUG = true;
angular.module('main_app', ['ui.router', 'account_prof', 'account_elev']).
config(function($stateProvider, $urlRouterProvider) {
    'use strict';
    $stateProvider
        .state('root', {
            url: "/",
            abstract: true,

            templateUrl: "modules/Home/Templates/Home.html",
            controller: function($state, $rootScope) {
                console.log("home controller.")
                console.log("home ctrrl userCredentials", userCredentials)

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
                        console.log("/cookie data ", data);
                        if (data != null && data != "") {
                            console.log("redirect")
                            userCredentials = data;
                            $rootScope.userCredentials = userCredentials;
                            if (data.tipUser == "teacher") {
                                $state.go('account_prof.dashboard');
                            } else {

                                $state.go('account_elev.dashboard');
                            }
                        } else {
                            console.log("no cookie. set user credentials to null")
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
                        console.log("/cookie data ", data);
                        if (data != null && data != "") {
                            console.log("redirect")
                            userCredentials = data;
                            $rootScope.userCredentials = userCredentials;
                            if (data.tipUser == "teacher") {
                                $state.go('account_prof.dashboard');
                            } else {

                                $state.go('account_elev.dashboard');
                            }
                        } else {
                            console.log("no cookie. set user credentials to null")
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
                        console.log("/cookie data ", data);
                        if (data != null && data != "") {
                            console.log("redirect")
                            userCredentials = data;
                            $rootScope.userCredentials = userCredentials;
                            if (data.tipUser == "teacher") {
                                $state.go('account_prof.dashboard');
                            } else {

                                $state.go('account_elev.dashboard');
                            }
                        } else {
                            console.log("no cookie. set user credentials to null")
                            userCredentials = null;
                            $rootScope.userCredentials = null;
                        }
                    })
                }
            }
        });
    $urlRouterProvider.otherwise('/main');

}).config(["$locationProvider", function($locationProvider) {
    //console.log("location provieder")
    //$locationProvider.html5Mode(true);
}]).run(function($rootScope, $http, $state) {
    console.log("run")
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        //console.log('error:', error, 'toState:', toState);
        console.log(error)
        if (error.status == "404") {
            console.log("this is a 404 error");
            //var url = $location.url();
            //console.log("url",url);
            $state.go("root.mainpage")
        }
    });

});