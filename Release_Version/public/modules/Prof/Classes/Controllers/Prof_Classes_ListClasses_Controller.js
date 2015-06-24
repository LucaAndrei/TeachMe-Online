'use strict';
var classes = [];
var prof_classes_list_classes_controller = function($scope, $http, $state, $rootScope, $timeout, classes) {
    $scope.userCredentials = userCredentials;
    $scope.emptyClassesList = null;
    $scope.classes = classes.data;

    $scope.class_name = "-";
    $scope.class_prof = "-";
    $scope.class_room = "-";
    $scope.class_day = "-";
    $scope.class_start_time = "-";
    $scope.class_end_time = "-";
    $scope.class_credite = "-";
    $scope.class_tip_exam = "-";
    $scope.class_descriere = "-";


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
        class_id = mClass._id;
    }

    $scope.deleteClass = function() {
        return $http.put('/api/users/deleteClass', {
            class_id: class_id
        }).success(function(data) {
            $("#class_modal").modal('hide');
            return $http.get('/api/users/listClasses').success(function(classes) {
                $scope.classes = classes;
                $scope.checkIfEmpty();
            });
        });
    }

}