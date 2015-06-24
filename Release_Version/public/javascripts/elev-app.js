var account_elev = angular.module('account_elev', ['ui.router', 'main_app']).
    config(function($stateProvider, $urlRouterProvider) {
        'use strict';

        $stateProvider
            .state('account_elev', {
                parent: 'root',
                url: "",
                templateUrl: "modules/Elev/MainPageElev.html",
                controller: function($scope, $state, $http, $rootScope) {
                    $scope.logout = function() {
                        $http.get('/api/users/loginToChat').success(function(data) {
                            if (data == "true") {
                                $rootScope.disconnectSocket();
                                $(".chat-message-nin-chat").removeClass("visible");
                                $(".chat-message-nin-chat").addClass("hidden")
                            }
                        })
                        return $http.get("/cookie").success(function(data) {
                            if (data != null && data != "") {
                                $http.get('/logout').success(function(data) {
                                    userCredentials = null;
                                    $rootScope.userCredentials = null;
                                    $state.go("root.mainpage")
                                })
                            } else {
                                userCredentials = null;
                                $rootScope.userCredentials = null;
                                $state.go("root.mainpage")
                            }
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
                        return $http.get('/api/users/calendar').success(function(data) {});
                    }
                }
            })
            .state('account_elev.grades', {
                url: "grades",
                templateUrl: "modules/Elev/Grades/Templates/Elev_Grades_ListGrades.html",
                controller: elev_grades_list_grades_controller,
                resolve: {
                    grades: function($http) {
                        return $http.get('/api/users/my_grades').success(function(data) {});
                    }
                }
            })
            .state('account_elev.classes', {
                url: "classes",
                templateUrl: "modules/Elev/Classes/Templates/Elev_Classes_ListClasses.html",
                controller: elev_classes_list_classes_controller,
                resolve: {
                    allClasses: function($http) {
                        return $http.get('/api/users/listAllClasses').success(function(data) {})
                    }
                }
            })
            .state('account_elev.exams', {
                url: "my_exams",
                templateUrl: "modules/Elev/Tasks/Templates/Elev_Tasks_Exams.html",
                controller: elev_tasks_exams_controller,
                resolve: {
                    exams: function($http) {
                        return $http.get('/api/users/exams').success(function(data) {});
                    }
                }
            })
            .state('account_elev.homework', {
                url: "my_homework",
                templateUrl: "modules/Elev/Tasks/Templates/Elev_Tasks_Homework.html",
                controller: elev_tasks_homework_controller,
                resolve: {
                    homework: function($http) {
                        return $http.get('/api/users/homework').success(function(data) {});
                    }
                }
            })
            .state('account_elev.test_teme_dnd', {
                url: "test_hw_dnd",
                templateUrl: "modules/Tests/Templates/Test_teme_DND.html",
                controller: function($scope, $state, $http) {
                    var today;
                    computeToday();

                    $scope.butQuitClicked = function() {
                        $state.go('account_elev.homework')
                    }

                    function computeToday() {
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
                        today = dd + '.' + mm + '.' + yyyy;

                    }
                    return $http.put('/api/users/userAccessedTest', {
                        idTest: "Test_DND_hw",
                        today: today
                    }).success(function(data) {});
                },
                resolve: {}
            })
            .state('account_elev.test_examen_dnd', {
                url: "test_exam_dnd",
                templateUrl: "modules/Tests/Templates/Test_examen_DND.html",
                controller: function($scope, $state, $http) {
                    var today;
                    computeToday();

                    $scope.butQuitClicked = function($event) {
                        if ($event.target.className == "disabled") {} else {
                            $state.go('account_elev.exams')
                        }
                    }

                    $("#quizContainer2").on("onEndedQuiz", function(evt) {
                        var nota_finala = (parseInt(evt.nota_test1) + parseInt(evt.nota_test2)) / 2;
                        var gradeToSave = {
                            name: "Examen Dnd",
                            nota: nota_finala,
                            data: today,
                            user: userCredentials._id,
                            tip: "exam"
                        }
                        return $http.put('/api/users/grades', gradeToSave).success(function(data) {});
                    });

                    function computeToday() {
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
                        today = dd + '.' + mm + '.' + yyyy;

                    }
                    return $http.put('/api/users/userAccessedTest', {
                        idTest: "Test_Dnd",
                        today: today
                    }).success(function(data) {});
                },
                resolve: {}
            })
            .state('account_elev.test_examen_radio', {
                url: "test_exam_radio",
                templateUrl: "modules/Tests/Templates/Test_examen_Radio.html",
                controller: function($scope, $state, $http) {
                    var today;
                    computeToday();

                    $scope.butQuitClicked = function($event) {
                        if ($event.target.className != "disabled") {
                            $state.go('account_elev.exams')
                        }
                    }

                    $("#quizContainer2").on("onEndedQuiz", function(evt) {
                        var nota_finala = (parseInt(evt.nota_test1) + parseInt(evt.nota_test2)) / 2;
                        var gradeToSave = {
                            name: "Examen Radio",
                            nota: nota_finala,
                            data: today,
                            user: userCredentials._id,
                            tip: "exam"
                        }
                        return $http.put('/api/users/grades', gradeToSave).success(function(data) {});
                    });

                    function computeToday() {
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
                        today = dd + '.' + mm + '.' + yyyy;

                    }
                    return $http.put('/api/users/userAccessedTest', {
                        idTest: "Test_Radio",
                        today: today
                    }).success(function(data) {});
                },
                resolve: {}
            })
            .state('account_elev.test_teme_radio', {
                url: "test_hw_radio",
                templateUrl: "modules/Tests/Templates/Test_teme_Radio.html",
                controller: function($scope, $state, $http) {
                    var today;
                    computeToday();

                    $scope.butQuitClicked = function() {
                        $state.go('account_elev.homework')
                    }

                    function computeToday() {
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
                        today = dd + '.' + mm + '.' + yyyy;

                    }
                    return $http.put('/api/users/userAccessedTest', {
                        idTest: "Test_Radio_hw",
                        today: today
                    }).success(function(data) {});
                },
                resolve: {}
            })
            .state('account_elev.test_examen_check', {
                url: "test_exam_check",
                templateUrl: "modules/Tests/Templates/Test_examen_Check.html",
                controller: function($scope, $state, $http) {
                    var today;
                    computeToday();

                    $scope.butQuitClicked = function($event) {
                        if ($event.target.className != "disabled") {
                            $state.go('account_elev.exams')
                        }
                    }

                    $("#quizContainer2").on("onEndedQuiz", function(evt) {
                        var nota_finala = (parseInt(evt.nota_test1) + parseInt(evt.nota_test2)) / 2;
                        var gradeToSave = {
                            name: "Examen Check",
                            nota: nota_finala,
                            data: today,
                            user: userCredentials._id,
                            tip: "exam"
                        }
                        return $http.put('/api/users/grades', gradeToSave).success(function(data) {});
                    });

                    function computeToday() {
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
                        today = dd + '.' + mm + '.' + yyyy;

                    }
                    return $http.put('/api/users/userAccessedTest', {
                        idTest: "Test_Check",
                        today: today
                    }).success(function(data) {});
                },
                resolve: {}
            })
            .state('account_elev.test_teme_check', {
                url: "test_hw_check",
                templateUrl: "modules/Tests/Templates/Test_teme_Check.html",
                controller: function($scope, $state, $http) {
                    var today;
                    computeToday();

                    $scope.butQuitClicked = function() {
                        $state.go('account_elev.homework')
                    }

                    function computeToday() {
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
                        today = dd + '.' + mm + '.' + yyyy;

                    }
                    return $http.put('/api/users/userAccessedTest', {
                        idTest: "Test_Check_hw",
                        today: today
                    }).success(function(data) {});
                },
                resolve: {}
            })
            .state('account_elev.profile_settings', {
                url: "settings",
                templateUrl: "modules/Settings/Templates/Settings.html",
                controller: settings_controller,
                resolve: {}
            })
            .state('account_elev.chat', {
                url: "chat",
                templateUrl: "/modules/Elev/Chat/Templates/Elev_Chat_ListUsers.html",
                controller: elev_chat_controller,
                resolve: {
                    allUsers: function($http) {
                        return $http.get('/api/users/listAllUsers').success(function(data) {});
                    },
                    loginUserToChat: function($http) {
                        return $http.get('/api/users/loginToChat').success(function(data) {})
                    }
                }
            });
        $urlRouterProvider.otherwise('/dashboard');

    }).run(function($rootScope, $http, $state) {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (error.status == "404") {
                $state.go("root.mainpage")
            }
        });
    });