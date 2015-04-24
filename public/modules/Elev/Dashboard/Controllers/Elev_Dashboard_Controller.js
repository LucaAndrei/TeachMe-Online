/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var elev_dashboard_controller = function($scope, $http, $state, $rootScope, $timeout){
    console.log("DashboardElevController.js : ",userCredentials);
    $scope.userCredentials = userCredentials;

    var contor_classes = 0;
    var contor_tasks = 0;

    var d = new Date();
	var weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	var n = weekday[d.getDay()];

    $http.get('/api/users/classes').success(function(data){
		for(var i = 0 ; i<data.length;i++){
			if(data[i].day == n){
				contor_classes++;
			}
		}
		if(contor_tasks > 0){
			$scope.number_classes = contor_tasks;
		} else {
			$scope.number_classes = 0;
		}
		$scope.number_classes = contor_classes;
	});
}
