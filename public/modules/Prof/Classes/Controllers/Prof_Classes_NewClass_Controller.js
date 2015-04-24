/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var classes = [];
var prof_classes_new_class_controller = function($scope, $http, $state, $rootScope, $timeout, promise) {
    console.log("prof_classes_new_class_controller.js : ", userCredentials);
    console.log("promise",promise);
    $scope.userCredentials = userCredentials;
    $scope.subjects = promise.data;
    $scope.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    $scope.subjectExists = false;
    $scope.error_subjectListEmpty = false;
    $scope.teacher = {name: userCredentials.nume+" " + userCredentials.prenume};
    $scope.error_time = false;
    $scope.error_room = false;
    $scope.error_subject = false;
    $scope.error_empty_string = false;

    if($scope.subjects.length > 0){
        $scope.error_subjectListEmpty = false;
    } else {
        $scope.error_subjectListEmpty = true;
    }

    $("#new_subject_modal").on('show.bs.modal', function () {
        /*
        */
        $("#subjectName").val("");
        $scope.subjectExists = false;
        $scope.error_empty_string = false;
        $scope.$apply();
        console.log($scope.error_empty_string)
    });

    $("#new_subject_modal").on('hide.bs.modal', function () {
        $scope.subjectExists = false;
    });



    $scope.addNewSubject = function(user) {
        console.log("ClassesApp -> scope add new subject " + user);
        console.log("scope subjects" + $scope.subjects.length)
        $scope.subjectExists = false;
        var objToInsert = {
            name: '' + $("#subjectName").val(),
            userId : userCredentials._id
        }
        if($("#subjectName").val() == ""){
            $scope.error_empty_string = true;
        } else {
            $scope.error_empty_string = false;
            for(var i = 0; i<$scope.subjects.length ; i++){
                if($scope.subjects[i].subject_name == $("#subjectName").val()){
                    console.log("subject exists");
                    $scope.subjectExists = true;
                    break;
                } else {
                    console.log("subject does not exist");
                    return $http.post('/addSubject', objToInsert).success(function(data) {
                            console.log(data[0])
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
    }

    $scope.addNewClass = function(user) {
        //console.log("sss", classesElevController)
        //console.log("dddddd", classesElevController.$scope)
        console.log($('#classSubject option:selected').text());
        var t = $('#classRoom').val();

        console.log("subject name : " + $('#classSubject option:selected').text())
        console.log("credite : " + $('#classCredite').val())
        console.log("tip exam : " + $("input:radio[name ='tipExamen']:checked").val())
        console.log("room : " + $('#classRoom').val())
        console.log("day : " + $('#classDay option:selected').text())
        console.log("start time : " + $('#start_time').val())
        console.log("end time : " + $('#end_time').val())
        console.log("teacher : " + $('#classTeacher').val())
        console.log("descriere : " + $('#descriptionClass').val())


        var start_time_hour = $('#start_time').val().split(":")[0];
        var end_time_hour = $('#end_time').val().split(":")[0];
        var start_time_minutes = $('#start_time').val().split(":")[1];
        var end_time_minutes = $('#end_time').val().split(":")[1];

        console.log("start_time_hour : " + start_time_hour)
                console.log("end_time_hour : " + end_time_hour)

        if($('#classRoom').val() == ""){
            console.log("room is empty")
            $scope.error_room = true;
        } else {
            $scope.error_room = false;
        }
        if($('#classSubject option:selected').text() == ""){
            console.log("room is empty")
            $scope.error_subject = true;
        } else {
            $scope.error_subject = false;
        }
        if(start_time_hour < end_time_hour){
            $scope.error_time = false;
        }
        if(start_time_hour > end_time_hour){
            console.log("error. ora de start e dupa ora de terminare")
            $scope.error_time = true;
        } else if((start_time_hour < end_time_hour) && ($('#classRoom').val() != "") && ($('#classSubject option:selected').text() != "")){
            console.log("correct. ora de terminare e dupa ora de start")
            $scope.error_time = false;
            $scope.error_room = false;
            $scope.error_subject = false;
            addNewClass()

        } else if(end_time_hour == start_time_hour){
            console.log("error. orele sunt egale")
            if((start_time_minutes < end_time_minutes) && $('#classRoom').val() != ""){
                addNewClass()
            } else {
                $scope.error_time = true;
            }
        }
    }




    function addNewClass(){
            console.log("add new class function");
            var mClass = {
                subject : '' + $('#classSubject option:selected').text(),
                credite : $('#classCredite').val(),
                tipExam : '' + $("input:radio[name ='tipExamen']:checked").val(),
                room : '' + $('#classRoom').val(),
                day : '' + $('#classDay option:selected').text(),
                start_time : '' + $('#start_time').val(),
                end_time : '' + $('#end_time').val(),
                teacher : '' + $('#classTeacher').val(),
                descriere : '' + $('#descriptionClass').val(),
                registeredUsers : []
            }

            return $http.post('/addClass/'+userCredentials._id,mClass).success(function(data) {
                $("#descriptionClass").val("");
                $("#classRoom").val("");
                console.log("ADAUGARE CLASS SUCCES ",data)
                $scope.$parent.classes.push(data);
                $scope.checkIfEmpty();
            });
    }
}


