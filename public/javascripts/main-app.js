var DEBUG = true;
angular.module('main_app', ['ui.router', 'account_prof','account_elev']).
    config(function($stateProvider, $urlRouterProvider) {
    'use strict';
    $stateProvider
        .state('root', {
            url: "/",
            templateUrl: "modules/Home/Templates/Home.html",
            controller: function($state,$rootScope){
                console.log("home controller.")
                console.log("home ctrrl userCredentials",userCredentials)
                $state.go("root.mainpage")
            },
            resolve: {}
        })
        .state('root.mainpage', {
            url: "main",
            templateUrl: "modules/Home/Templates/MainPage.html",
            controller: mainControler,
            resolve: {}
        })
        .state('root.login', {
            url: "login",
            templateUrl: "modules/Authentication/Templates/SignIn.html",
            controller: loginController,
            resolve: {}
        })
        .state('root.signup', {
            url: "signup",
            templateUrl: "modules/Authentication/Templates/SignUp.html",
            controller: signUpController,
            resolve: {}
        });
        $urlRouterProvider.otherwise('/main');

}).config(["$locationProvider", function($locationProvider) {
    //console.log("location provieder")
    //$locationProvider.html5Mode(true);
}]).run(function ($rootScope, $http){
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.log('error:', error, 'toState:', toState);
    });
});
