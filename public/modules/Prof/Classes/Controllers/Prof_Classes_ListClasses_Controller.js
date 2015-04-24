/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var classes = [];
var prof_classes_list_classes_controller = function($scope, $http, $state, $rootScope, $timeout, promise) {
    console.log("prof_classes_list_classes_controller.js : ", userCredentials);

    $scope.userCredentials = userCredentials;
    $scope.emptyClassesList = null;
    $scope.classes = promise.data;

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
        console.log("checkIfEmpty");
        //angular.copy(userCredentials.userClasses, classes);
        if ($scope.classes.length > 0) {
            $scope.emptyClassesList = false;
        } else if ($scope.classes.length == 0) {
            $scope.emptyClassesList = true;
        }
    }

    $scope.checkIfEmpty();



    $scope.selectClass = function(mClass) {
        console.log("select mClass : ");
        console.dir(mClass);
        //$("#selectedClass").css("display","block");
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
    //$state.go('account_elev.signup');

   /*$("#class_modal").on('show.bs.modal', function (mClass) {
    });*/


    $scope.deleteClass = function() {
        console.log("delete class  :" + class_id)
        console.log("delete class   userCredentials._id:" + userCredentials._id)
        return $http.put('/deleteClass', {
            class_id: class_id
        }).success(function(data) {
            console.log("correctly deleted");
            console.dir(data);
            $("#class_modal").modal('hide');
            return $http.get('/listClasses/'+userCredentials._id).success(function(classes){
                console.log("list classes after delete : ",classes)
                $scope.classes = classes;
                $scope.checkIfEmpty();
            });
        });
    }

}

