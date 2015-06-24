'use strict';
var elev_tasks_homework_controller = function($scope, $http, $state, $rootScope, $timeout, homework) {
    var homeworkArray = [];
    computeHomeworkArray(homework.data);

    $('.nota').tooltip();

    $scope.homeworkArr = homeworkArray;
    if ($scope.homeworkArr.length == 0) {
        $scope.emptyList = true;
    } else {
        $scope.emptyList = false;
    }

    function computeHomeworkArray(homework) {

        for (var i = 0; i < homework.length; i++) {
            var myHW = {
                nume: homework[i].numeTest,
                id: homework[i]._id
            }
            for (var j = 0; j < homework[i].registeredUsers.length; j++) {
                if (homework[i].registeredUsers[j].idUser == userCredentials._id) {
                    myHW.incercari = homework[i].registeredUsers[j].incercari;
                    myHW.lastAccessed = homework[i].registeredUsers[j].lastAccessed;
                }
            }
            homeworkArray.push(myHW);
        }
    }

    $scope.goToTest = function(homeworkName) {
        switch (homeworkName) {
            case "Test_DND_hw":
                $state.go('account_elev.test_teme_dnd');
                break;
            case "Test_Radio_hw":
                $state.go('account_elev.test_teme_radio');
                break;
            case "Test_Check_hw":
                $state.go('account_elev.test_teme_check');
                break;
            default:
                break;
        }
    }
}