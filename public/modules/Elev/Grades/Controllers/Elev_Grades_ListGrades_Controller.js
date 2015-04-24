/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var elev_grades_list_grades_controller = function($scope, $http, $state, $rootScope, $timeout){
    console.log("gradesElevController.js : ",userCredentials);
    var grades = [];
    $scope.userCredentials = userCredentials;
    $scope.grades = grades;
    $scope.emptyList = null;
    /*if($scope.grades.length > 0){
		$("#userGradesEmpty").hide();
		$(".gradesTable").show();
	}
*/
    getUsersGrades(userCredentials._id);
    function getUsersGrades(id){
    	console.log("gradesService -> id " + id);

		// This method is called when 'Show Grades' button is pressed, in the resolve of this route
		// The parameter received is accessed with $route.current.params.user and it represents the id of the user for which we want to know the grades

		//o.userSelectedForGrades(id);
		return $http.get('/grades/' + id).success(function(data){
			console.log("gradesService -> data : " + data);
			angular.copy(data, grades);
			if(grades.length > 0){
				$scope.emptyList = false;
			} else if(grades.length == 0){
				$scope.emptyList = true;
			}
			console.log("gradesService -> o.grades : ", $scope.emptyList);
		});
    }

    console.log("here")
    //$state.go('account_elev.signup');
}