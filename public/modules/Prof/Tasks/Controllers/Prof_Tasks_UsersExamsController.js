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

    $scope.tasksArray = tasksArray;

    if ($scope.selectedUser) {
        console.log("empty list false")
        $scope.emptyList = false;
    } else {
        console.log("empty list true")
        $scope.emptyList = true;
    }



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
                $http.put('/api/users/modifyAccessToUser/'+$scope.selectedUser._id, tasksArray[i]).success(function(data) {
                    console.log("revokeAccessToUser data",data);
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
                $http.put('/api/users/modifyAccessToUser/'+$scope.selectedUser._id, tasksArray[i]).success(function(data) {
                    console.log("grantAccessToUser data",data);
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
}
