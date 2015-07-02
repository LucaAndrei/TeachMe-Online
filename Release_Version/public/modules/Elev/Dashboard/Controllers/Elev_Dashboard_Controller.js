'use strict';
var elev_dashboard_controller = function($scope, $http, $state, $rootScope, $timeout) {
    $scope.userCredentials = userCredentials;

    var d = new Date();
    var weekday = new Array(5);
    weekday[0] = "Duminica";
    weekday[1] = "Luni";
    weekday[2] = "Marti";
    weekday[3] = "Miercuri";
    weekday[4] = "Joi";
    weekday[5] = "Vineri";
    weekday[6] = "Sambata";
    var n = weekday[d.getDay()];

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