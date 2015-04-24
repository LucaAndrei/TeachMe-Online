/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var loginController = function($scope, $http, $state, $rootScope, $timeout){
    console.log("LoginController.js");
    console.log("userCredentials : " + userCredentials)
    $scope.sendAuth = function(){
        console.log("sendAuth");
        console.log($scope.password);
        console.log($scope.email)

        var user = {pass: $scope.password, email: $scope.email};
        $scope.clicked_login = true;

        $http.post('/login',user).success(function (data) {
            console.log("success received object0")
            console.log(data)

            userCredentials = data;
            $rootScope.userCredentials = userCredentials;

            if(userCredentials.tipUser == "teacher"){
                console.log("GO TO ACCOUNT PROF")
                $state.go('account_prof');
            } else {
                console.log("GO TO ACCOUNT ELEV")
                $state.go('account_elev');
            }
        }).error(function () {
            console.log("error")
        });
    }
}

var signUpController =  function($scope, $http, $state, $rootScope, $timeout){
    console.log("SignUpController.js");
    //$state.go('root.login');
}
