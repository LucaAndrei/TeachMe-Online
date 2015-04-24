/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var prof_chat_controller = function($scope, $http, $state, $rootScope, $timeout, promise,online_users_promise){
    console.log("prof_chat_controller.js : ",userCredentials);
    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = promise.data;
    var online_users = [];
    for(var i = 0; i < promise.data.length ; i++){
        console.log("promise data isonline : " + promise.data[i].isOnline)
        /*
        if(promise.data[i]._id == online_users_promise.data[i]._id){
            online_users.push(promise.data[i]);
        }*/
    }
    $scope.online_users = online_users;
    if ($scope.users.length > 0) {
        $scope.emptyList = false;
    } else if ($scope.users.length == 0) {
        $scope.emptyList = true;
    }

}
