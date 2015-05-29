'use strict';
var classes = [];
var prof_classes_new_class_controller = function($scope, $http, $state, $rootScope, $timeout, promise) {
    //console.log("prof_classes_new_class_controller.js : ", userCredentials);
    $scope.userCredentials = userCredentials;
    $scope.subjects = promise.data;
    $scope.days = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri'];
    $scope.subjectExists = false;
    $scope.error_subjectListEmpty = false;
    $scope.teacher = {
        name: userCredentials.nume + " " + userCredentials.prenume
    };
    $scope.error_time = false;
    $scope.error_room = false;
    $scope.error_subject = false;
    $scope.error_empty_string = false;

    if ($scope.subjects.length > 0) {
        $scope.error_subjectListEmpty = false;
    } else {
        $scope.error_subjectListEmpty = true;
    }

    $("#new_subject_modal").on('show.bs.modal', function() {
        $("#subjectName").val("");
        $scope.subjectExists = false;
        $scope.error_empty_string = false;
        $scope.$apply();
    });

    $("#new_subject_modal").on('hide.bs.modal', function() {
        $scope.subjectExists = false;
    });



    $scope.addNewSubject = function(user) {
        console.log("add new subject")
        $scope.subjectExists = false;
        var objToInsert = {
            name: '' + $("#subjectName").val(),
            userId: userCredentials._id
        }
        if ($("#subjectName").val() == "") {
            $scope.error_empty_string = true;
        } else {
            $scope.error_empty_string = false;
            if($scope.subjects.length > 0){
                for (var i = 0; i < $scope.subjects.length; i++) {
                    if ($scope.subjects[i].subject_name == $("#subjectName").val()) {
                        $scope.subjectExists = true;
                        break;
                    } else {
                        return $http.post('/api/users/addSubject', objToInsert).success(function(data) {
                            $scope.subjects.push(data[0]);
                            if ($scope.subjects.length > 0) {
                                $scope.error_subjectListEmpty = false;
                            }
                            $("#new_subject_modal").modal("hide");
                            $scope.subjectExists = false;
                        });
                    }
                }
            } else {
                return $http.post('/api/users/addSubject', objToInsert).success(function(data) {
                    $scope.subjects.push(data[0]);
                    if ($scope.subjects.length > 0) {
                        $scope.error_subjectListEmpty = false;
                    }
                    $("#new_subject_modal").modal("hide");
                    $scope.subjectExists = false;
                });
            }
        }
    }

    $scope.addNewClass = function(user) {
        var t = $('#classRoom').val();


        var start_time_hour = parseInt($('#start_time').val().split(":")[0]);
        var end_time_hour = parseInt($('#end_time').val().split(":")[0]);
        var start_time_minutes = parseInt($('#start_time').val().split(":")[1]);
        var end_time_minutes = parseInt($('#end_time').val().split(":")[1]);

        if ($('#classRoom').val() == "") {
            $scope.error_room = true;
        } else {
            $scope.error_room = false;
        }
        if ($('#classSubject option:selected').text() == "") {
            $scope.error_subject = true;
        } else {
            $scope.error_subject = false;
        }
        if (start_time_hour < end_time_hour) {
            $scope.error_time = false;
        }
        if (start_time_hour > end_time_hour) {
            $scope.error_time = true;
        } else if ((start_time_hour < end_time_hour) && ($('#classRoom').val() != "") && ($('#classSubject option:selected').text() != "")) {
            $scope.error_time = false;
            $scope.error_room = false;
            $scope.error_subject = false;
            addNewClass()

        } else if (end_time_hour == start_time_hour) {
            if ((start_time_minutes < end_time_minutes) && $('#classRoom').val() != "") {
                addNewClass()
            } else {
                $scope.error_time = true;
            }
        }
    }




    function addNewClass() {
        var mClass = {
            subject: '' + $('#classSubject option:selected').text(),
            credite: $('#classCredite').val(),
            tipExam: '' + $("input:radio[name ='tipExamen']:checked").val(),
            room: '' + $('#classRoom').val(),
            day: '' + $('#classDay option:selected').text(),
            start_time: '' + $('#start_time').val(),
            end_time: '' + $('#end_time').val(),
            teacher: '' + $('#classTeacher').val(),
            descriere: '' + $('#descriptionClass').val(),
            registeredUsers: []
        }

        return $http.post('/api/users/addClass', mClass).success(function(data) {
            $("#descriptionClass").val("");
            $("#classRoom").val("");
            $scope.$parent.classes.push(data);
            $scope.checkIfEmpty();
        });
    }
}