var DEBUG = true;
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
                    console.log("logging out");
                    $rootScope.disconnectSocket();
                    return $http.get("/cookie").success(function(data) {
                        //console.log("/cookie data ", data);
                        if (data != null && data != "") {
                            $http.get('/logout').success(function(data) {
                                //console.log("data on logout", data);
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
                    return $http.get('/api/users/calendar').success(function(data) {
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
                grades: function($http) {
                    return $http.get('/api/users/my_grades').success(function(data) {
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
                promise: function($http) {
                    return $http.get('/api/users/listAllClasses').success(function(data) {
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
                exams: function($http) {
                        return $http.get('/api/users/exams').success(function(data) {
                            console.log(">>>>>>>>>>>>>exams-> data : ", data);
                        });
                    }
            }
        })
        .state('account_elev.homework', {
            url: "my_homework",
            templateUrl: "modules/Elev/Tasks/Templates/Elev_Tasks_Homework.html",
            controller: elev_tasks_homework_controller,
            resolve: {
                homework: function($http) {
                        return $http.get('/api/users/homework').success(function(data) {
                            console.log(">>>>>>>>>>>>>homework-> data : ", data);
                        });
                    }
            }
        })
        .state('account_elev.test_teme_dnd', {
            url: "test_hw_dnd",
            templateUrl: "modules/Tests/Templates/Test_teme_DND.html",
            controller: function($scope, $state, $http) {
                console.log("test teme dnd controller")
                var today;
                computeToday();

                $scope.butQuitClicked = function(){
                    console.log("BUT QUIT CLICKED")

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
                    console.log("dd " + dd)
                    console.log("mm " + mm)
                    console.log("yyyy " + yyyy)
                    today = dd + '.' + mm + '.' + yyyy;

                }
                return $http.put('/api/users/userAccessedTest', {
                    idTest: "Test_DND_hw",
                    today: today
                }).success(function(data) {
                    console.log("userAccessedTest data", data);
                });
            },
            resolve: {}
        })
        .state('account_elev.test_examen_dnd', {
            url: "test_exam_dnd",
            templateUrl: "modules/Tests/Templates/Test_examen_DND.html",
            controller: function($scope, $state, $http) {
                console.log("test exam dnd controller")
                var today;
                computeToday();

                $scope.butQuitClicked = function($event){
                    console.log("BUT QUIT CLICKED")
                    if($event.target.className =="disabled"){
                        console.log("THIS TARGET HAS CLASS DISABLED")
                    } else {
                        $state.go('account_elev.exams')
                    }
                }



                $("#quizContainer2").on("onEndedQuiz", function(evt){
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!",evt)
                    var nota_finala = (parseInt(evt.nota_test1) + parseInt(evt.nota_test2))/2;
                    var gradeToSave = {
                        name: "Examen Dnd",
                        nota: nota_finala,
                        data: today,
                        user : userCredentials._id,
                        tip : "exam"
                    }
                    return $http.put('/api/users/grades', gradeToSave).success(function(data) {
                        console.log("saved grade",data);
                    });
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
                    console.log("dd " + dd)
                    console.log("mm " + mm)
                    console.log("yyyy " + yyyy)
                    today = dd + '.' + mm + '.' + yyyy;

                }
                return $http.put('/api/users/userAccessedTest', {
                    idTest: "Test_Dnd",
                    today: today
                }).success(function(data) {
                    console.log("userAccessedTest data", data);
                });
            },
            resolve: {}
        })
.state('account_elev.test_examen_radio', {
            url: "test_exam_radio",
            templateUrl: "modules/Tests/Templates/Test_examen_Radio.html",
            controller: function($scope, $state, $http) {
                console.log("test exam radio controller")
                var today;
                computeToday();

                $scope.butQuitClicked = function($event){
                    console.log("BUT QUIT CLICKED")
                    if($event.target.className =="disabled"){
                        console.log("THIS TARGET HAS CLASS DISABLED")
                    } else {
                        $state.go('account_elev.exams')
                    }
                }

                $("#quizContainer2").on("onEndedQuiz", function(evt){
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!",evt)
                    var nota_finala = (parseInt(evt.nota_test1) + parseInt(evt.nota_test2))/2;
                    var gradeToSave = {
                        name: "Examen Radio",
                        nota: nota_finala,
                        data: today,
                        user : userCredentials._id,
                        tip : "exam"
                    }
                    return $http.put('/api/users/grades', gradeToSave).success(function(data) {
                        console.log("saved grade",data);
                    });
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
                    console.log("dd " + dd)
                    console.log("mm " + mm)
                    console.log("yyyy " + yyyy)
                    today = dd + '.' + mm + '.' + yyyy;

                }
                return $http.put('/api/users/userAccessedTest', {
                    idTest: "Test_Radio",
                    today: today
                }).success(function(data) {
                    console.log("userAccessedTest data", data);
                });
            },
            resolve: {}
        })
.state('account_elev.test_teme_radio', {
            url: "test_hw_radio",
            templateUrl: "modules/Tests/Templates/Test_teme_Radio.html",
            controller: function($scope, $state, $http) {
                console.log("test teme radio controller")
                var today;
                computeToday();

                $scope.butQuitClicked = function(){
                    console.log("BUT QUIT CLICKED")
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
                    console.log("dd " + dd)
                    console.log("mm " + mm)
                    console.log("yyyy " + yyyy)
                    today = dd + '.' + mm + '.' + yyyy;

                }
                return $http.put('/api/users/userAccessedTest', {
                    idTest: "Test_Radio_hw",
                    today: today
                }).success(function(data) {
                    console.log("userAccessedTest data", data);
                });
            },
            resolve: {}
        })
.state('account_elev.test_examen_check', {
            url: "test_exam_check",
            templateUrl: "modules/Tests/Templates/Test_examen_Check.html",
            controller: function($scope, $state, $http) {
                console.log("test exam check controller")
                var today;
                computeToday();

                $scope.butQuitClicked = function($event){
                    console.log("BUT QUIT CLICKED")
                    if($event.target.className =="disabled"){
                        console.log("THIS TARGET HAS CLASS DISABLED")
                    } else {
                        $state.go('account_elev.exams')
                    }
                }

                $("#quizContainer2").on("onEndedQuiz", function(evt){
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!",evt)
                    var nota_finala = (parseInt(evt.nota_test1) + parseInt(evt.nota_test2))/2;
                    var gradeToSave = {
                        name: "Examen Check",
                        nota: nota_finala,
                        data: today,
                        user : userCredentials._id,
                        tip : "exam"
                    }
                    return $http.put('/api/users/grades', gradeToSave).success(function(data) {
                        console.log("saved grade",data);
                    });
                });
                    //if (evt.valid){

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
                    console.log("dd " + dd)
                    console.log("mm " + mm)
                    console.log("yyyy " + yyyy)
                    today = dd + '.' + mm + '.' + yyyy;

                }
                return $http.put('/api/users/userAccessedTest', {
                    idTest: "Test_Check",
                    today: today
                }).success(function(data) {
                    console.log("userAccessedTest data", data);
                });
            },
            resolve: {}
        })
.state('account_elev.test_teme_check', {
            url: "test_hw_check",
            templateUrl: "modules/Tests/Templates/Test_teme_Check.html",
            controller: function($scope, $state, $http) {
                console.log("test teme check controller")
                var today;
                computeToday();

                $scope.butQuitClicked = function(){
                    console.log("BUT QUIT CLICKED")
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
                    console.log("dd " + dd)
                    console.log("mm " + mm)
                    console.log("yyyy " + yyyy)
                    today = dd + '.' + mm + '.' + yyyy;

                }
                return $http.put('/api/users/userAccessedTest', {
                    idTest: "Test_Check_hw",
                    today: today
                }).success(function(data) {
                    console.log("userAccessedTest data", data);
                });
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
                promise: function($http) {
                    return $http.get('/api/users/listAllUsers').success(function(data) {
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
    $urlRouterProvider.otherwise('/dashboard');

}).run(function($rootScope, $http, $state) {
    console.log("run elev aPP");
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