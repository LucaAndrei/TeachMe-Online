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

    //alert("cocoshel");
    /*checkCredentials();

    // variablia workspaceHeight contine inaltimea device-ului
    $timeout(function(){
        var height = $('.topBarDelimiter').offset().top - $('.bottomBar').offset().top;
        if(height < 0){
            height = height*(-1);
        }
        $rootScope.workspaceHeight = height;
        $rootScope.workspaceWidth = $(window).width();
    });

    $(window).bind('resize', function() {
        var height = $('.topBarDelimiter').offset().top - $('.bottomBar').offset().top;
        if(height < 0){
            height = height*(-1);
        }
        //console.log("MainController : resized height : " + height);
        $rootScope.workspaceHeight = height;
        $rootScope.workspaceWidth = $(window).width();
    });

    // functia de logout
    $rootScope.userLogout = function(){

        if(userCredentials == null){
            $state.go('root.home');
            userCredentials = null;
        }else{
            $http.delete('/api/users/deleteSession/'+ userCredentials.UserId).success(function (data) {
                $state.go('root.home');
                userCredentials = null;
                $rootScope.userCredentials = null;
                document.cookie = "CautOrice_Session=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            });
        }
    }*/
}
