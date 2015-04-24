/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var loginController = function($scope, $http, $state, $rootScope, $timeout){
    console.log("LoginController.js");
    //$state.go('root.signup');
    console.log("userCredentials : " + userCredentials)
    $scope.sendAuth = function(){
    	console.log("sendAuth");
        console.log($scope.password);
    console.log($scope.email)



    	/*$http.post('/login').success(function (data) {
    		console.log(" succes login");
    	});*/
var user = {pass: $scope.password, email: $scope.email};
        $scope.clicked_login = true;

        $http.post('/login',user).success(function (data) {
            console.log("success received object0")
            console.log(data)
            userCredentials = data.user;
            $rootScope.userCredentials = userCredentials;
            console.log("rootscope user credentials auth ctrl",$rootScope.userCredentials)
            console.log("asdddddd : " + data.userSession.SessionEnd)
            var date = new Date(parseInt(data.userSession.SessionEnd));
            var expires = "; expires=" + date.toGMTString();

            console.log("date is : " + date);
            console.log("expires is : " + expires)
            var thisSession = "TeachMe_Session=" + data.userSession.SessionCookie + "" +  expires + "; path=/";
            console.log("thisSession is :" + thisSession)
            document.cookie = thisSession;

            console.log("--------------------------==============================")
            console.log(document);
            console.log(">>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            console.log(document.cookie);




            if(userCredentials.tipUser == "teacher"){
                console.log("GO TO ACCOUNT PROF")
                $state.go('account_prof');
            } else {
                console.log("GO TO ACCOUNT ELEV")
                $state.go('account_elev');
            }
            /*var date = new Date(data[0].SessionEnd);
            var expires = "; expires=" + date.toGMTString();
            $scope.clicked_login = false;

            document.cookie = "CautOrice_Session=" + data[0].SessionCookie + expires + "; path=/";
            userCredentials = data[0];
            $rootScope.userCredentials = userCredentials;
            $scope.error_login = false;

            $state.go('accounts');*/
        }).error(function () {
            console.log("error")
            /*$scope.clicked_login = false;
            $scope.error_login = true;
            userCredentials = null;
            $rootScope.userCredentials = null;*/
        });

/*
return $http.post('/login',{
            pass : '2',
            email : '2'
        }).success(function(data){
                        console.log("here")
                        //if(DEBUG){
                            console.log("classesService -> data : " + data);
                           // globalCurrentUser = data;
                            //o.getUsersGrades(globalCurrentUser._id);
                        //}
                    });

        /*var user = {Password: $scope.parola, Email: $scope.email};

        $http.get('/api/users/' + $scope.email + '/'+ $scope.parola).success(function (data) {
            var date = new Date(data[0].SessionEnd);
            var expires = "; expires=" + date.toGMTString();

            document.cookie = "CautOrice_Session=" + data[0].SessionCookie + expires + "; path=/";
            userCredentials = data[0];
            $rootScope.userCredentials = userCredentials;

            $state.go('accounts');
        }).error(function () {
            $("#login-error").removeClass("hidden");
            userCredentials = null;
            $rootScope.userCredentials = null;
        });*/

    }
}

var signUpController =  function($scope, $http, $state, $rootScope, $timeout){
    console.log("SignUpController.js");
    //$state.go('root.login');
}
