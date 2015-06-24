'use strict';
var elev_dashboard_controller = function($scope, $http, $state, $rootScope, $timeout) {
    $scope.userCredentials = userCredentials;

    var d = new Date();
    var weekday = new Array(5);
    weekday[0] = "Luni";
    weekday[1] = "Marti";
    weekday[2] = "Miercuri";
    weekday[3] = "Joi";
    weekday[4] = "Vineri";
    var n = weekday[d.getDay() - 4];

    $http.get('/api/users/exams').success(function(data) {
        $scope.nr_examene = data.length;
        if(data.length == 1){
            $scope.text_examen = "Examen";
        } else {
            $scope.text_examen = "Examene";
        }
    });

    $http.get('/api/users/my_classes/'+n).success(function(data) {
        $scope.nr_cursuri = data.length;
    });

    $http.get('/api/users/my_messages').success(function(data) {
        $scope.nr_mesaje = data;
    });

    $scope.nr_mesaje = 0;
    $scope.nr_cursuri = 0;
    $scope.nr_examene = 0;
}