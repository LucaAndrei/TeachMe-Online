'use strict';
var prof_tasks_users_exams_controller = function($scope, $http, $state, $rootScope, $timeout, selectedUserPromise, tasksPromise) {
    //console.log("prof_tasks_users_exams_controller.js : ",userCredentials);
    console.dir(tasksPromise.data);
    var users = [];
    var selectedUser = [];
    var tasksArray = [];
    checkIfSelectedUserHasAccess();

    $scope.userCredentials = userCredentials;
    $scope.selectedUser = selectedUserPromise.data;

    $scope.tasksArray = tasksArray;

    // function called when the button EDIT from the template is pressed
    // this is used to show the edit/delete button and to make a dropdown list from the grade.
    $scope.revokeAcess = function(customId) {
        var task;
        var found = false;
        for (var i = 0; i < tasksArray.length; i++) {
            if (tasksArray[i].customId == customId) {
                tasksArray[i].hasAccess = false;
                tasksArray[i].incercari = "-";
                tasksArray[i].lastAccessed = "-";
                found = true;
                break;
            }
        }
        if (found) {
            $http.put('/api/users/modifyAccessToUser/' + $scope.selectedUser._id, tasksArray[i]).success(function(data) {});
        }
    }

    $scope.grantAccess = function(customId) {
        var task;
        var found = false;
        for (var i = 0; i < tasksArray.length; i++) {
            if (tasksArray[i].customId == customId) {
                tasksArray[i].hasAccess = true;
                tasksArray[i].incercari = 0;
                tasksArray[i].lastAccessed = "-";
                found = true;
                break;
            }
        }
        if (found) {
            $http.put('/api/users/modifyAccessToUser/' + $scope.selectedUser._id, tasksArray[i]).success(function(data) {});
        }
    }


    function checkIfSelectedUserHasAccess() {
        for (var i = 0; i < tasksPromise.data.length; i++) {
            var myObj = {
                nume: tasksPromise.data[i].numeTest,
                incercari: "-",
                lastAccessed: "-",
                hasAccess: false,
                customId: tasksArray.length + 1,
                id: tasksPromise.data[i]._id
            }
            if (tasksPromise.data[i].registeredUsers.length > 0) {
                for (var j = 0; j < tasksPromise.data[i].registeredUsers.length; j++) {
                    if (selectedUserPromise.data._id == tasksPromise.data[i].registeredUsers[j].idUser) {
                        myObj.incercari = tasksPromise.data[i].registeredUsers[j].incercari;
                        myObj.lastAccessed = tasksPromise.data[i].registeredUsers[j].lastAccessed;
                        myObj.hasAccess = true;

                        break;
                    }
                }
            }
            tasksArray.push(myObj);
        }
    }
}