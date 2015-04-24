var mainControler = function($scope, $http, $state, $rootScope, $timeout){
    console.log("MainController.js");
    console.log("rootScope userCredentials",$rootScope.userCredentials)
    console.log("userCredentials",userCredentials)
    if(userCredentials != null && userCredentials != ""){
        console.log("intra cumva pe-aici?")
        if(userCredentials.tipUser == "teacher"){
            $state.go('account_prof');
        } else {
            $state.go('account_elev');
        }
    }
}
