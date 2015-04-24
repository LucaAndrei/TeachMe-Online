var DEBUG = true;
var account_elev = angular.module('account_elev', ['ui.router','main_app']).
    config(function($stateProvider, $urlRouterProvider) {
    'use strict';

    $stateProvider
        .state('account_elev', {
            parent: 'root',
            url: "",
            templateUrl: "modules/Elev/MainPageElev.html",
            controller : function($scope,$state,$http,$rootScope){
                $scope.logout = function(){
                    $http.get('/api/users/logout').success(function(data){
                        console.log("data on logout",data);
                        userCredentials = null;
                        $rootScope.userCredentials = null;
                        $state.go("root.mainpage")
                    })
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
            resolve: {
                calendar_events: function($http) {
                    return $http.get('/api/users/calendar').success(function(data){
                        console.log("calendarService -> data : " + data);
                    });
                }
            }
        })
        .state('account_elev.grades', {
            url: "grades",
            templateUrl: "modules/Elev/Grades/Templates/Elev_Grades_ListGrades.html",
            controller: elev_grades_list_grades_controller,
            resolve: {
                grades : function($http) {
                    return $http.get('/api/users/my_grades').success(function(data){
                        console.log("myGrades -> data : " + data);
                    });
                }
            }
        })
        .state('account_elev.classes', {
            url: "classes",
            templateUrl: "modules/Elev/Classes/Templates/Elev_Classes_ListClasses.html",
            controller: elev_classes_list_classes_controller,
            resolve: {
                    promise : function($http){
                        return $http.get('/api/users/listAllClasses').success(function(data){
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
                    return $http.get('/api/users/exams').success(function(data) {
                        console.log(">>>>>>>>>>>>>exams-> data : ",data);
                    });
                }
                /*tasksPromise : function($http){
                    return $http.get('/api/users/my_tasks/' + userCredentials._id).success(function(data) {
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
                    today = dd + '.' + mm + '.' + yyyy;

                }
                $http.put('/api/users/userAccessedTest',{idTest : "Test_Dnd", today : today}).success(function(data) {
                    console.log("userAccessedTest data",data);
                });
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
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        console.log('error:', error, 'toState:', toState );
    });
});