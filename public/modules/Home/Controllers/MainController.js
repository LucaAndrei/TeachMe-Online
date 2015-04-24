var mainControler = function($scope, $http, $state, $rootScope, $timeout, userLoggedIn){
    console.log("MainController.js");
    console.log("rootScope userCredentials",$rootScope.userCredentials)
    console.log("userCredentials",userCredentials)


    if(userLoggedIn.data != null && userLoggedIn.data != ""){
        console.log("intra cumva pe-aici?")
        if(userLoggedIn.data.tipUser == "teacher"){
            $state.go('account_prof');
        } else {
            $state.go('account_elev');
        }
    }
}
