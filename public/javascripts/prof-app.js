var DEBUG = true;
var account_prof = angular.module('account_prof', ['ui.router', 'main_app']).
config(function($stateProvider, $urlRouterProvider) {
    'use strict';
    //console.log("state : " + $state.$current)
    $stateProvider
        .state('account_prof', {
            parent: 'root',
            url: "",
            templateUrl: "modules/Prof/MainPageProf.html",
            controller: function($scope, $state, $http, $rootScope) {
                $scope.logout = function() {
                    console.log("logging out");
                    //$rootScope.disconnectSocket();
                    return $http.get("/cookie").success(function(data) {
                        console.log("/cookie data ", data);
                        if (data != null && data != "") {
                            $http.get('/logout').success(function(data) {
                                console.log("data on logout", data);
                                userCredentials = null;
                                $rootScope.userCredentials = null;
                                $state.go("root.mainpage")
                            })
                        } else {
                            console.log("no cookie. set user credentials to null")
                            userCredentials = null;
                            $rootScope.userCredentials = null;
                            $state.go("root.mainpage")
                        }
                    })

                }
                console.log("aicishaaaaaa<<<<<<<<<<<<<<<<<<<")
                $state.go("account_prof.dashboard")
            },
            resolve: {}
        })
        .state('account_prof.dashboard', {
            url: "dashboard",
            templateUrl: "/modules/Prof/Dashboard/Templates/Prof_Dashboard.html",
            controller: prof_dashboard_controller,
            resolve: {}
        })
        .state('account_prof.calendar', {
            url: "calendar",
            templateUrl: "/modules/Calendar/Templates/Calendar.html",
            controller: calendar_controller,
            resolve: {
                calendar_events: function($http) {
                    return $http.get('/api/users/calendar').success(function(data) {
                        console.log("calendarService -> data : " + data);
                    });
                }
            }
        })
        .state('account_prof.grades', {
            url: "grades",
            templateUrl: "/modules/Prof/Grades/Templates/Prof_Grades_ListUsers.html",
            controller: prof_grades_list_users_controller,
            resolve: {
                promise: function($http) {
                    return $http.get('/api/users/listUsers').success(function(data) {
                        console.log("promise data", data);
                    });
                }
            }
        })
        .state('account_prof.usersGrades', {
            url: "grades/:ID",
            templateUrl: "/modules/Prof/Grades/Templates/Prof_Grades_UsersGrades.html",
            controller: prof_grades_users_grades_controller,
            resolve: {
                usersClasses: function($http, $stateParams) {
                    return $http.get('/api/users/registeredClasses/' + $stateParams.ID).success(function(data) {
                        console.log("promise usersClasses", data);
                    });
                },
                selectedUserPromise: function($http, $stateParams) {
                    console.log("selectedUserPromise : " + $stateParams.ID)
                    return $http.get('/api/users/getSelectedUser/' + $stateParams.ID).success(function(data) {
                        console.log(">>>>>>>>>>>>> getSelectedUser selectedUserPromise-> data : ", data);
                    });
                }
            }
        })
        .state('account_prof.classes', {
            url: "classes",
            templateUrl: "/modules/Prof/Classes/Templates/Prof_Classes_ListClasses.html",
            controller: prof_classes_list_classes_controller,
            resolve: {
                promise: function($http) {
                    return $http.get('/api/users/listClasses').success(function(data) {
                        console.log("list classes promise data", data);
                    })
                }
            }
        })
        .state('account_prof.classes.newClass', {
            url: "/newClass",
            templateUrl: "/modules/Prof/Classes/Templates/Prof_Classes_NewClass.html",
            controller: prof_classes_new_class_controller,
            resolve: {
                promise: function($http) {
                    return $http.get('/api/users/listSubjects').success(function(data) {
                        console.log("new class promise data", data);
                    })
                }
            }
        })
        .state('account_prof.exams', {
            url: "exams",
            templateUrl: "/modules/Prof/Tasks/Templates/Prof_Tasks_Exams_ListUsers.html",
            controller: prof_exams_controller,
            resolve: {
                promise: function($http) {
                    return $http.get('/api/users/listUsers').success(function(data) {
                        console.log("promise data", data);
                    });
                }
            }
        })
        .state('account_prof.homework', {
            url: "homework",
            templateUrl: "/modules/Prof/Tasks/Templates/Prof_Tasks_Homework_ListUsers.html",
            controller: prof_homework_controller,
            resolve: {
                promise: function($http) {
                    return $http.get('/api/users/listUsers').success(function(data) {
                        console.log("promise data", data);
                    });
                }
            }
        })
        .state('account_prof.usersExams', {
            url: "exams/:ID",
            templateUrl: "/modules/Prof/Tasks/Templates/Prof_Tasks_UsersExams.html",
            controller: prof_tasks_users_exams_controller,
            resolve: {
                selectedUserPromise: function($http, $stateParams) {
                    console.log("selectedUserPromise : " + $stateParams.ID)
                    return $http.get('/api/users/getSelectedUser/' + $stateParams.ID).success(function(data) {
                        console.log(">>>>>>>>>>>>> getSelectedUser selectedUserPromise-> data : ", data);
                    });
                },
                tasksPromise: function($http) {
                    return $http.get('/api/users/tasks_exam').success(function(data) {
                        console.log(">>>>>>>>>>>>> tasks_exam tasks-> data : ", data);
                    });
                }
            }
        })
        .state('account_prof.usersHomework', {
            url: "homework/:ID",
            templateUrl: "/modules/Prof/Tasks/Templates/Prof_Tasks_UsersHomework.html",
            controller: prof_tasks_users_homework_controller,
            resolve: {
                selectedUserPromise: function($http, $stateParams) {
                    console.log("selectedUserPromise : " + $stateParams.ID)
                    return $http.get('/api/users/getSelectedUser/' + $stateParams.ID).success(function(data) {
                        console.log(">>>>>>>>>>>>> getSelectedUser selectedUserPromise-> data : ", data);
                    });
                },
                tasksPromise: function($http) {
                    return $http.get('/api/users/tasks_hw').success(function(data) {
                        console.log(">>>>>>>>>>>>> tasks_hw tasks-> data : ", data);
                    });
                }
            }
        })
        .state('account_prof.profile_settings', {
            url: "settings",
            templateUrl: "/modules/Settings/Templates/Settings.html",
            controller: settings_controller,
            resolve: {}
        })
        .state('account_prof.chat', {
            url: "chat",
            templateUrl: "/modules/Prof/Chat/Templates/Prof_Chat_ListUsers.html",
            controller: prof_chat_controller,
            resolve: {
                promise: function($http) {
                    return $http.get('/api/users/listUsers').success(function(data) {
                        console.log("promise data", data);
                    });
                },
                loginUserToChat : function($http) {
                    return $http.get('/api/users/loginToChat').success(function(data){
                        console.log("is logged in to chat",data)
                    })
                }
            }
        });

    console.log("here")

    $urlRouterProvider.otherwise('/dashboard');

}).run(function($rootScope, $http, $state) {
    console.log("run profApp");
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.log('error:', error, 'toState:', toState);
        console.log(error)
        if (error.status == "404") {
            console.log("this is a 404 error");
            //var url = $location.url();
            //console.log("url",url);
            $state.go("root.mainpage")
        }
    });
});