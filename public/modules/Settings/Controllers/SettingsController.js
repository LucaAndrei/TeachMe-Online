/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var settings_controller = function($scope, $http, $state, $rootScope, $timeout) {
    console.log("settings_controller.js : ", userCredentials);
    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.error_numeUpdate = false;
    $scope.error_prenumeUpdate = false;
    $scope.error_emailUpdate = false;
    $scope.updateProfile = function() {
        if($('#numeUpdate').val() == ""){
            console.log("numeUpdate is empty")
            $scope.error_numeUpdate = true;
        } else {
            $scope.error_numeUpdate = false;
        }
        if($('#prenumeUpdate').val() == ""){
            console.log("prenumeUpdate is empty")
            $scope.error_prenumeUpdate = true;
        } else {
            $scope.error_prenumeUpdate = false;
        }
        if($('#emailUpdate').val() == ""){
            console.log("emailUpdate is empty")
            $scope.error_emailUpdate = true;
        } else {
            $scope.error_emailUpdate = false;
        }
        if(($('#numeUpdate').val() != "") && ($('#prenumeUpdate').val() != "") && ($('#emailUpdate').val() != "")){
            console.log("ready to update");
            var updatedUser = {
                nume : $('#numeUpdate').val(),
                prenume : $('#prenumeUpdate').val(),
                email : $('#emailUpdate').val()
            }
            $http.put('/api/users/updateUser',updatedUser).success(function(data){
                console.log("data after update",data);
                $("#msg-correct").css("display","block");
                setTimeout(function(){
                    $("#msg-correct").css("display","none");
                }, 2000)
            })
        }
    }
}