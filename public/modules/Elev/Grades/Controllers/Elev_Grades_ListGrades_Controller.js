/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var elev_grades_list_grades_controller = function($scope, $http, $state, $rootScope, $timeout, grades){
    console.log("gradesElevController.js : ",userCredentials);
    console.log("Grades",grades.data.length);
    $scope.userCredentials = userCredentials;
    $scope.emptyList = null;
    if(grades.data.length > 0){
		$scope.emptyList = false;
		$scope.grades = grades.data;
	} else if(grades.data.length == 0){
		$scope.emptyList = true;
	}
}