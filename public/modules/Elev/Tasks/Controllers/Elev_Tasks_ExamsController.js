/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var elev_tasks_exams_controller = function($scope, $http, $state, $rootScope, $timeout,exams){
    console.log("elev_tasks_exams_controller.js : ",userCredentials);
    console.log("taskspromise");
    var examsArray = [];
    computeExamsArray(exams.data);

    $scope.exams = examsArray;
    console.log($scope.exams)
    if($scope.exams.length == 0){
        console.log("USER HAS NO ACCESS TO ANY EXAMS");
    } else {
        console.log("USER HAS ACCESS TO EXAMS");
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
                $state.go('account_elev.test_dnd');
                break;
            case "Test_Radio":
                console.log("this is test radio");
                break;
            case "Test_Check":
                console.log("this is test check");
                break;
            default:
            break;
        }
    }
    //console.dir(tasksPromise.data);
    /*var users = [];
    var selectedUser = [];
    var tasksArray = [];
    $scope.emptyList = false;
    checkIfSelectedUserHasAccess();

    $scope.userCredentials = userCredentials;
    $scope.selectedUser = selectedUserPromise.data;
    //$scope.tasks = selectedUserPromise.data.tasks;
    //$scope.emptyTasksList = false;

    $scope.tasksArray = tasksArray;

    if ($scope.selectedUser) {
        console.log("empty list false")
        $scope.emptyList = false;
    } else {
        console.log("empty list true")
        $scope.emptyList = true;
    }*/
   /* if($scope.tasks.length > 0){
        $scope.emptyTasksList = false;
    } else if($scope.tasks.length == 0) {
        $scope.emptyTasksList = true;
    }*/



    // function called when the button EDIT from the template is pressed
    // this is used to show the edit/delete button and to make a dropdown list from the grade.
    /*$scope.revokeAcess = function(customId) {
        console.log("$scope.revokeAcess customId : " + customId)
        for (var i = 0; i < tasksArray.length; i++) {
            if (tasksArray[i].customId == customId) {
                console.log("found what task to revoke");
                tasksArray[i].hasAccess = false;
                tasksArray[i].incercari = "-";
                tasksArray[i].lastAccessed =  "-";
                break;
            }
        }
    }

    $scope.grantAccess = function(customId) {
        console.log("$scope.grantAccess customId : " + customId)
        for (var i = 0; i < tasksArray.length; i++) {
            if (tasksArray[i].customId == customId) {
                console.log("found what task to revoke");
                tasksArray[i].hasAccess = true;
                tasksArray[i].incercari = 0;
                tasksArray[i].lastAccessed =  "-";
                break;
            }
        }
    }


    function checkIfSelectedUserHasAccess(){
        console.log("check : ",tasksArray)
        for(var i = 0; i < tasksPromise.data.length ;i++){
            console.log("tasksPromise.data[i].registeredUsers.length : " + tasksPromise.data[i].registeredUsers.length)
            var myObj = {
                            nume : tasksPromise.data[i].numeTest,
                            incercari : "-",
                            lastAccessed : "-",
                            hasAccess : false,
                            customId: tasksArray.length + 1,
                        }
            if(tasksPromise.data[i].registeredUsers.length > 0){
                console.log("tasksPromise.data _id " + tasksPromise.data[i]._id);
                for(var j = 0; j<tasksPromise.data[i].registeredUsers.length ; j++){
                    console.log("user id : " + tasksPromise.data[i].registeredUsers[j].idUser);
                    if(selectedUserPromise.data._id == tasksPromise.data[i].registeredUsers[j].idUser){
                        console.log("user found");
                        myObj.incercari = tasksPromise.data[i].registeredUsers[j].incercari;
                        myObj.lastAccessed = tasksPromise.data[i].registeredUsers[j].lastAccessed;
                        myObj.hasAccess = true;

                        break;
                    }
                }
            } else {
                console.log("this task has no registeredUsers")
            }
            tasksArray.push(myObj);
        }
    }*/

    /*computeTasks();

    function computeTasks(){
        var tasksNames = ["Test Radio", "Test Check", "Test DND"];
        for (var i = 0; i < 3; i++) {
            console.log("$scope.tasks[i].nota " + $scope.tasks[i].nota);
            if($scope.tasks[])

            var myObj = {
                name : tasksNames[i],
                incercari : $scope.tasks[]
                uid: $scope.tasks[i]._id,
                customId: tasksArray.length + 1,
                nume: $scope.tasks[i].name,
                nota: $scope.tasks[i].nota,
                data: $scope.tasks[i].data,
                user: $scope.grades[i].user,
                status: $scope.grades[i].nota,
                validated: true,
                editing: false
            };
            $("#selectedUserSubjectGrade-" + myObj.customId).text("" + ($scope.grades[i].nota));
            tasksArray.push(myObj);
        }
    }*/



}
