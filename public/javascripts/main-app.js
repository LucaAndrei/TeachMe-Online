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
    console.log("run main");
    document.cookie = "CautOrice_Session=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    console.log(document)
    /*console.log(document)
    console.log(document.cookie)
    var cookie = getCookie('CautOrice_Session');
    console.log('cookie : ' + cookie)

    if(cookie == "" || cookie == undefined || cookie == null ){//|| cookie.length != 26){
        //window.location = '#/home';
        console.log("whadu")
        //document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

        document.cookie = "CautOrice_Session=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        //document.cookie= "CautOrice_Session=123;"// expires=Thu, 01 Jan 1970 00:00:00 UTC";
        console.log(document)
        userCredentials = null;
    }
    console.log("document.cookie : ",document.cookie)*/
        /*var cookie = getCookie('CautOrice_Session');

        if(cookie != "" && cookie != undefined && cookie != null && cookie.length == 26) {
            $http.get('/api/users/cookie/' + cookie).success(function (data) {

                userCredentials = data;
                checkCredentials($rootScope);

            }).error(function () {

                userCredentials = null;
                $rootScope.userCredentials = null;

            });
        }

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
            console.log('error:', error, 'toState:', toState );
        });*/
});
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    console.log("ca : ",ca)
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        console.log("c",c)
        while (c.charAt(0)==' ') {
            c = c.substring(1);
            console.log("while")
        }
        console.log("name",name)
        console.log(c.indexOf(name));
        if (c.indexOf(name) == 0) console.log("!!!!",c.substring(name.length,c.length));
        return c.substring(name.length,c.length);
    }
    return "";
}