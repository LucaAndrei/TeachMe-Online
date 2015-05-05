/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var elev_tasks_homework_controller = function($scope, $http, $state, $rootScope, $timeout,homework){
    console.log("elev_tasks_homework_controller.js : ",userCredentials);
    var homeworkArray = [];
    computeHomeworkArray(homework.data);

    $('[data-toggle="tooltip"]').tooltip({
            placement : 'bottom'
        });

    $scope.homeworkArr = homeworkArray;
    console.log($scope.homework)
    if($scope.homeworkArr.length == 0){
        console.log("USER HAS NO ACCESS TO ANY HOMEWORK");
        $scope.emptyList = true;
    } else {
        console.log("USER HAS ACCESS TO HOMEWORK");
        $scope.emptyList = false;
    }

    function computeHomeworkArray(homework){

        for(var i = 0; i<homework.length;i++){
            console.log("homework[i]",homework[i])
            var myHW = {
                nume : homework[i].numeTest,
                id : homework[i]._id
            }
            for(var j = 0; j<homework[i].registeredUsers.length;j++){
                if(homework[i].registeredUsers[j].idUser == userCredentials._id){
                    console.log("found")
                    myHW.incercari = homework[i].registeredUsers[j].incercari;
                    myHW.lastAccessed = homework[i].registeredUsers[j].lastAccessed;
                }
            }
            homeworkArray.push(myHW);
        }
    }

    $scope.goToTest = function(homeworkName){
        console.log("homeworkName is : " + homeworkName);
        switch(homeworkName){
            case "Test_DND_hw":
                console.log("This is test DND homework");
                $state.go('account_elev.test_teme_dnd');
                break;
            case "Test_Radio_hw":
                console.log("this is test radio homework");
                $state.go('account_elev.test_teme_radio');
                break;
            case "Test_Check_hw":
                console.log("this is test  homework");
                $state.go('account_elev.test_teme_check');
                break;
            default:
            break;
        }
    }
}
