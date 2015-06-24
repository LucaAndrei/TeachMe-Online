'use strict';
var elev_tasks_exams_controller = function($scope, $http, $state, $rootScope, $timeout, exams) {
    var examsArray = [];
    computeExamsArray(exams.data);

    $('.nota').tooltip();

    $scope.exams = examsArray;
    if ($scope.exams.length == 0) {
        $scope.emptyList = true;
    } else {
        $scope.emptyList = false;
    }

    function computeExamsArray(exams) {

        for (var i = 0; i < exams.length; i++) {
            var myExam = {
                nume: exams[i].numeTest,
                id: exams[i]._id
            }
            for (var j = 0; j < exams[i].registeredUsers.length; j++) {
                if (exams[i].registeredUsers[j].idUser == userCredentials._id) {
                    myExam.incercari = exams[i].registeredUsers[j].incercari;
                    myExam.lastAccessed = exams[i].registeredUsers[j].lastAccessed;
                }
            }
            examsArray.push(myExam);
        }
    }

    $scope.goToTest = function(examName) {
        switch (examName) {
            case "Test_Dnd":
                $state.go('account_elev.test_examen_dnd');
                break;
            case "Test_Radio":
                $state.go('account_elev.test_examen_radio');
                break;
            case "Test_Check":
                $state.go('account_elev.test_examen_check');
                break;
            default:
                break;
        }
    }
}