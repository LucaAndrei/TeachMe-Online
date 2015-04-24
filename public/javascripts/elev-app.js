var DEBUG = true;
var account_elev = angular.module('account_elev', ['ui.router','main_app']).
    config(function($stateProvider, $urlRouterProvider) {
    'use strict';

    $stateProvider
        .state('account_elev', {
            parent: 'root',
            url: "",
            templateUrl: "modules/Elev/MainPageElev.html",
            controller: function($scope,$state){
                $scope.logout = function(){
                    userCredentials = null;
                    $state.go('root.mainpage');
                }
                $state.go("account_elev.dashboard");
            },
            resolve: {}
        })
        .state('account_elev.dashboard', {
            url: "dashboard",
            templateUrl: "modules/Elev/Dashboard/Templates/Elev_Dashboard.html",
            controller: elev_dashboard_controller,
            resolve: {}
        })
        .state('account_elev.calendar', {
            url: "calendar",
            templateUrl: "modules/Calendar/Templates/Calendar.html",
            controller: calendar_controller,
            resolve: {}
        })
        .state('account_elev.grades', {
            url: "grades",
            templateUrl: "modules/Elev/Grades/Templates/Elev_Grades_ListGrades.html",
            controller: elev_grades_list_grades_controller,
            resolve: {}
        })
        .state('account_elev.classes', {
            url: "classes",
            templateUrl: "modules/Elev/Classes/Templates/Elev_Classes_ListClasses.html",
            controller: elev_classes_list_classes_controller,
            resolve: {
                    promise : function($http){
                        return $http.get('/listAllClasses').success(function(data){
                            console.log("list classes promise data", data);
                        })
                    }
                }

        })
        .state('account_elev.exams', {
            url: "my_exams",
            templateUrl: "modules/Elev/Tasks/Templates/Elev_Tasks_Exams.html",
            controller: elev_tasks_exams_controller,
            resolve: {
                exams:function($http){
                    return $http.get('/exams/'+userCredentials._id).success(function(data) {
                        console.log(">>>>>>>>>>>>>exams-> data : ",data);
                    });
                }
                /*tasksPromise : function($http){
                    return $http.get('/tasks').success(function(data) {
                        console.log(">>>>>>>>>>>>> usersExams tasks-> data : ",data);
                    });
                }*/
            }
        })
        .state('account_elev.test_dnd', {
            url: "test_dnd",
            templateUrl: "modules/Tests/Templates/Test_DND.html",
            controller : function($scope,$state,$http){
                console.log("test dnd controller")
                var today;
                computeToday();
                function computeToday(){
                    today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd
                    }
                    if (mm < 10) {
                        mm = '0' + mm
                    }
                    console.log("dd " + dd)
                    console.log("mm " + mm)
                    console.log("yyyy " + yyyy)
                    //console.log("computeToday " + today)
                    today = dd + '.' + mm + '.' + yyyy;

                }
                $http.put('/userAccessedTest/'+userCredentials._id,{idTest : "Test_Dnd", today : today}).success(function(data) {
                    console.log("userAccessedTest data",data);
                });
                /*$scope.logout = function(){
                    userCredentials = null;
                    $state.go('root.mainpage');
                }
                console.log("aicishaaaaaa<<<<<<<<<<<<<<<<<<<")
                $state.go("account_prof.dashboard")*/
            },
            resolve: {}
        })
        .state('account_elev.profile_settings', {
            url: "settings",
            templateUrl: "modules/Settings/Templates/Settings.html",
            controller: settings_controller,
            resolve: {}
        });
        $urlRouterProvider.otherwise('/dashboard');

}).run(function ($rootScope, $http){
    console.log("run elev aPP");

        /*var cookie = getCookie('CautOrice_Session');

        if(cookie != "" && cookie != undefined && cookie != null && cookie.length == 26) {
            $http.get('/api/users/cookie/' + cookie).success(function (data) {

                userCredentials = data;
                checkCredentials($rootScope);

            }).error(function () {

                userCredentials = null;
                $rootScope.userCredentials = null;

            });
        }
*/
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
            console.log('error:', error, 'toState:', toState );
        });
});
/*templateUrl : 'views/dashboardElev.html',
        controller : 'dashboardElevController',
        resolve: {
            // The resolve will execute before anything else. It will take all the users from the database so they can be used in the controller
            // The rendering of the page will not continue until it receives the result from the promise (which is asynchronous)
            postPromise: ['dashboardElevService', function(dashboardElevService){
                //dashboardElevService.getCurrentUser();
                //computeToday();
                return dashboardElevService.getCurrentUser();

            }]
        }*/

