'use strict';
var prof_dashboard_controller = function($scope, $http, $state, $rootScope, $timeout) {
    //console.log("prof_dashboard_controller.js : ",userCredentials);
    $scope.userCredentials = userCredentials;

    $http.get('/api/users/listUsers').success(function(data) {
		$scope.nr_useri = data.length;
	});

	var contor_classes = 0;

    var d = new Date();
    var weekday = new Array(5);
    weekday[0] = "Luni";
    weekday[1] = "Marti";
    weekday[2] = "Miercuri";
    weekday[3] = "Joi";
    weekday[4] = "Vineri";
    var n = weekday[d.getDay() - 1];

	$http.get('/api/users/prof_classes/'+n).success(function(data) {
    	console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (data[i].day == n) {
                contor_classes++;
            }
        }
        $scope.nr_cursuri = contor_classes;
    });

    $scope.nr_mesaje = 0;
    $scope.nr_cursuri = 0;
    $scope.nr_useri = 0;
}