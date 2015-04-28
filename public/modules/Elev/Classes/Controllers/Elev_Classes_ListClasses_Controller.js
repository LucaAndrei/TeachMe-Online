'use strict';
var classes = [];
var elev_classes_list_classes_controller = function($scope, $http, $state, $rootScope, $timeout, promise) {
    var myClasses = promise.data;
    var commonClasses = [];
    var totalCredite = 0;
    if (myClasses.length > 0) {
        for (var t = 0; t < myClasses.length; t++) {
            var mClass = {
                _id: myClasses[t]._id,
                subject: myClasses[t].subject,
                credite: myClasses[t].credite,
                day: myClasses[t].day,
                descriere: myClasses[t].descriere,
                end_time: myClasses[t].end_time,
                room: myClasses[t].room,
                start_time: myClasses[t].start_time,
                teacher: myClasses[t].teacher,
                tipExam: myClasses[t].tipExam,
                registered: false
            }
            if (myClasses[t].registeredUsers.length > 0) {
                for (var i = 0; i < myClasses[t].registeredUsers.length; i++) {
                    if (("" + myClasses[t].registeredUsers[i]) == userCredentials._id) {
                        mClass.registered = true;
                        totalCredite += myClasses[t].credite;
                    }
                }
            }
            commonClasses.push(mClass);
        }
        $scope.classes = commonClasses;
    }
    $scope.userCredentials = userCredentials;
    $scope.emptyClassesList = null;
    $scope.classes = commonClasses;

    $scope.total_credite = totalCredite;

    $scope.class_name = "-";
    $scope.class_prof = "-";
    $scope.class_room = "-";
    $scope.class_day = "-";
    $scope.class_start_time = "-";
    $scope.class_end_time = "-";
    $scope.class_credite = "-";
    $scope.class_tip_exam = "-";
    $scope.class_descriere = "-";
    $scope.class_registered = false;


    var class_id = null;

    $scope.checkIfEmpty = function() {
        if ($scope.classes.length > 0) {
            $scope.emptyClassesList = false;
        } else if ($scope.classes.length == 0) {
            $scope.emptyClassesList = true;
        }
    }

    $scope.checkIfEmpty();



    $scope.selectClass = function(mClass) {
        if (mClass.subject == "") {
            $scope.class_name = "-";
        } else {
            $scope.class_name = mClass.subject;
        }

        if (mClass.teacher == "") {
            $scope.class_prof = "-";
        } else {
            $scope.class_prof = mClass.teacher;
        }

        if (mClass.room == "") {
            $scope.class_room = "-";
        } else {
            $scope.class_room = mClass.room;
        }

        if (mClass.day == "") {
            $scope.class_day = "-";
        } else {
            $scope.class_day = mClass.day;
        }

        if (mClass.start_time == "") {
            $scope.class_start_time = "-";
        } else {
            $scope.class_start_time = mClass.start_time;
        }

        if (mClass.end_time == "") {
            $scope.class_end_time = "-";
        } else {
            $scope.class_end_time = mClass.end_time;
        }

        if (mClass.credite == "") {
            $scope.class_credite = "-";
        } else {
            $scope.class_credite = mClass.credite;
        }

        if (mClass.tipExam == "") {
            $scope.class_tip_exam = "-";
        } else {
            $scope.class_tip_exam = mClass.tipExam;
        }

        if (mClass.descriere == "") {
            $scope.class_descriere = "-";
        } else {
            $scope.class_descriere = mClass.descriere;
        }

        if (mClass.registered == true) {
            $scope.class_registered = true;
        } else {
            $scope.class_registered = false;
        }
        class_id = mClass._id;
    }

    $scope.registerClass = function() {
        return $http.post('/api/users/registerClass', {
            class_id: class_id
        }).success(function(data) {
            console.dir(data);
            buildClassesArray()
            $("#class_modal").modal('hide');
        });
    }


    function buildClassesArray() {
        return $http.get('/api/users/listAllClasses').success(function(classes) {
            commonClasses = [];
            myClasses = classes;
            totalCredite = 0;
            if (myClasses.length > 0) {
                for (var t = 0; t < myClasses.length; t++) {
                    var mClass = {
                        _id: myClasses[t]._id,
                        subject: myClasses[t].subject,
                        credite: myClasses[t].credite,
                        day: myClasses[t].day,
                        descriere: myClasses[t].descriere,
                        end_time: myClasses[t].end_time,
                        room: myClasses[t].room,
                        start_time: myClasses[t].start_time,
                        teacher: myClasses[t].teacher,
                        tipExam: myClasses[t].tipExam,
                        registered: false
                    }
                    if (myClasses[t].registeredUsers.length > 0) {
                        for (var i = 0; i < myClasses[t].registeredUsers.length; i++) {
                            if (("" + myClasses[t].registeredUsers[i]) == userCredentials._id) {
                                mClass.registered = true;
                                totalCredite += myClasses[t].credite;
                            }
                        }
                    }
                    commonClasses.push(mClass);
                }
                $scope.total_credite = totalCredite;
                $scope.classes = commonClasses;
            }
        });
    }
}