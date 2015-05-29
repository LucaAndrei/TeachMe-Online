'use strict';
var elev_tasks_exams_controller = function($scope, $http, $state, $rootScope, $timeout,exams){
    console.log("elev_tasks_exams_controller.js : ",userCredentials);

    var examsArray = [];
    computeExamsArray(exams.data);

    $('.nota').tooltip();


    $scope.exams = examsArray;
    console.log($scope.exams)
    if($scope.exams.length == 0){
        $scope.emptyList = true;
    } else {
        $scope.emptyList = false;
    }

    function computeExamsArray(exams){

        for(var i = 0; i<exams.length;i++){
            console.log("exams[i]",exams[i])
            var myExam = {
                nume : exams[i].numeTest,
                id : exams[i]._id
            }
            for(var j = 0; j<exams[i].registeredUsers.length;j++){
                if(exams[i].registeredUsers[j].idUser == userCredentials._id){
                    console.log("found")
                    myExam.incercari = exams[i].registeredUsers[j].incercari;
                    myExam.lastAccessed = exams[i].registeredUsers[j].lastAccessed;
                }
            }
            examsArray.push(myExam);
        }
    }

    $scope.goToTest = function(examName){
        console.log("exam Name is : " + examName);
        switch(examName){
            case "Test_Dnd":
                console.log("This is test DND");
                $state.go('account_elev.test_examen_dnd');
                break;
            case "Test_Radio":
                console.log("this is test radio");
                $state.go('account_elev.test_examen_radio');
                break;
            case "Test_Check":
                console.log("this is test check");
                $state.go('account_elev.test_examen_check');
                break;
            default:
            break;
        }
    }
}
