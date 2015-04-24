/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var prof_grades_list_users_controller = function($scope, $http, $state, $rootScope, $timeout, promise) {
    console.log("dashboardProfController.js : ", userCredentials);
    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = promise.data;
    if ($scope.users.length > 0) {
        $scope.emptyList = false;
    } else if ($scope.users.length == 0) {
        $scope.emptyList = true;
    }
    console.log("promise : ", promise.data);


    var timestamp = userCredentials._id.toString().substring(0,8);
    var date = new Date( parseInt( timestamp, 16 ) * 1000 );
    console.log("timestamp : " + timestamp);
    console.log("date : " + date);
}