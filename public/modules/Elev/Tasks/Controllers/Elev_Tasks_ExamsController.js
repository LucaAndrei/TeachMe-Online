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
}
