/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var prof_tasks_users_exams_controller = function($scope, $http, $state, $rootScope, $timeout,selectedUserPromise,tasksPromise){
    console.log("prof_tasks_users_exams_controller.js : ",userCredentials);
    console.log("taskspromise");
    console.dir(tasksPromise.data);
    var users = [];
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
    }
   /* if($scope.tasks.length > 0){
        $scope.emptyTasksList = false;
    } else if($scope.tasks.length == 0) {
        $scope.emptyTasksList = true;
    }*/



    // function called when the button EDIT from the template is pressed
    // this is used to show the edit/delete button and to make a dropdown list from the grade.
    $scope.revokeAcess = function(customId) {
        console.log("$scope.revokeAcess customId : " + customId)
        var task;
        var found = false;
        for (var i = 0; i < tasksArray.length; i++) {
            if (tasksArray[i].customId == customId) {
                console.log("found what task to revoke");
                tasksArray[i].hasAccess = false;
                tasksArray[i].incercari = "-";
                tasksArray[i].lastAccessed =  "-";
                found = true;
                break;
            }
        }
        if(found){
                $http.put('/modifyAccessToUser/'+$scope.selectedUser._id, tasksArray[i]).success(function(data) {
                    console.log("revokeAccessToUser data",data);
                    //console.log("OPERATIA S-A TERMINAT CU SUCCES " + data.name)
                    /*console.log("add new usbj string  : " + data.toString());
                    console.log("add new usbj msg: " + data.message)
                    if (data.message == null) {
                        console.log("jsonul asta nu are un mesaj");
                        $scope.subjects.push(data);
                        if ($scope.subjects.length > 0) {
                            $scope.error_subjectListEmpty = false;
                        }
                        $("#new_subject_modal").modal("hide");
                        $scope.subjectExists = false;
                    } else {
                        console.log("jsonul asta are un mesaj");
                        $scope.subjectExists = true;
                    }*/
                });
        } else {
            console.log("error. task not found to revoke access");
        }
    }

    $scope.grantAccess = function(customId) {
        console.log("$scope.grantAccess customId : " + customId)
        var task;
        var found = false;
        for (var i = 0; i < tasksArray.length; i++) {
            if (tasksArray[i].customId == customId) {
                console.log("found what task to revoke");
                tasksArray[i].hasAccess = true;
                tasksArray[i].incercari = 0;
                tasksArray[i].lastAccessed =  "-";
                found = true;
                break;
            }
        }
        if(found){
                $http.put('/modifyAccessToUser/'+$scope.selectedUser._id, tasksArray[i]).success(function(data) {
                    console.log("grantAccessToUser data",data);
                    //console.log("OPERATIA S-A TERMINAT CU SUCCES " + data.name)
                    /*console.log("add new usbj string  : " + data.toString());
                    console.log("add new usbj msg: " + data.message)
                    if (data.message == null) {
                        console.log("jsonul asta nu are un mesaj");
                        $scope.subjects.push(data);
                        if ($scope.subjects.length > 0) {
                            $scope.error_subjectListEmpty = false;
                        }
                        $("#new_subject_modal").modal("hide");
                        $scope.subjectExists = false;
                    } else {
                        console.log("jsonul asta are un mesaj");
                        $scope.subjectExists = true;
                    }*/
                });
        } else {
            console.log("error. task not found");
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
                            id : tasksPromise.data[i]._id
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
    }

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
