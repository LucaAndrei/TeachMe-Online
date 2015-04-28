var mainControler = function($scope, $http, $state, $rootScope, $timeout, userLoggedIn) {
    if (userLoggedIn.data != null && userLoggedIn.data != "") {
        if (userLoggedIn.data.tipUser == "teacher") {
            $state.go('account_prof');
        } else {
            $state.go('account_elev');
        }
    }
}