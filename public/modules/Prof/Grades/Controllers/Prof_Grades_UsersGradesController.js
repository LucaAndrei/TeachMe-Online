/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.

*/
'use strict';
var prof_grades_users_grades_controller = function($scope, $http, $state, $rootScope, $timeout, $stateParams, $filter, usersClasses, selectedUserPromise) {
    console.log("Grades for user. Users Classes : ",usersClasses)
    var selectedUser = [];
    var gradesNames = [];
    $scope.gradesNames = gradesNames;
    $scope.userCredentials = userCredentials;
    $scope.gradeNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    $scope.emptyGradesList = null;
    var selectedUserGrades = [];
    $scope.gradesArray = selectedUserGrades;
    $scope.disableAddRow = false;
    $scope.selectedUser = selectedUserPromise.data;
    $scope.grades = selectedUserPromise.data.grades;
    if ($scope.grades.length > 0) {
        $scope.emptyGradesList = false;
    } else if ($scope.grades.length == 0) {
        $scope.emptyGradesList = true;
    }
    computeSelectedUserGrades();
    computeGradesNames();
    computeToday();


    $scope.noGrades = [
    {value: 1,text: '1'},
    {value: 2,text: '2'},
    {value: 3,text: '3'},
    {value: 4,text: '4'},
    {value: 5,text: '5'},
    {value: 6,text: '6'},
    {value: 7,text: '7'},
    {value: 8,text: '8'},
    {value: 9,text: '9'},
    {value: 10,text: '10'} ];




    //userSelectedForGrades($stateParams.ID);
    $scope.mySelect = $scope.gradesNames[0];


    $scope.showGrade = function(grade) {
        console.log("showGrade : ", grade);
        var selected = [];
        if (grade.status) {
            //console.log("i am here : " + grade.status)
            selected = $filter('filter')($scope.noGrades, {
                value: grade.status
            });
            //console.log("selected : " + selected[0].text)
        }
        return selected.length ? selected[0].text : 'Not set';
    };


    $scope.saveGrade = function(customId) {
        console.log("$scope.saveGrade >> customId : " + customId);
        var x = $("#selectedUserSubject-" + customId).val(); // this takes the value from the subject names select list from the frontend
        var y = $("#selectedUserGrade-" + customId).val();
        console.log("x : " + x + " >>>> $scope.gradesNames[x] numeMaterie : " + $scope.gradesNames[x] + " >>>> y : " + y + " >>> $scope.gradeNumbers[y] notaMaterie: " + $scope.gradeNumbers[y]);
        var gradeToSave;
        for (var i = 0; i < selectedUserGrades.length; i++) {
            if (selectedUserGrades[i].customId == customId) {
                console.log("IT HAS BEEN FOUND !!!!!!!!!")
                selectedUserGrades[i].validated = true;
                selectedUserGrades[i].editing = false;
                selectedUserGrades[i].nume = $scope.gradesNames[x];// this maps the value from the subject names select list from the frontend to a string
                selectedUserGrades[i].nota = $scope.gradeNumbers[y];
                selectedUserGrades[i].status = $scope.gradeNumbers[y];
                console.log("today : " + $scope.today);
                gradeToSave = {
                    name: selectedUserGrades[i].nume,
                    nota: selectedUserGrades[i].nota,
                    data: $scope.today,
                    uid: selectedUserGrades[i].uid
                }
                break;
            }
        }
        return $http.put('/api/users/grades/' + $scope.selectedUser._id, gradeToSave).success(function(data) {
            console.log("assignGrade data : ", data);
            $scope.disableAddRow = false;
        });
    };

    // this method is called when the teacher presses the SaveEdit button from the template.
    $scope.saveEditGrade = function(customId) {
        console.log("$scope.editGrade")
        for (var i = 0; i < selectedUserGrades.length; i++) {
            if (selectedUserGrades[i].customId == customId) {
                console.log("grade found");
                var x = $("#selectedUserGrade-" + customId).val();
                console.log("(#selectedUserGrade- + customId).val() : " + x + " >>>> $scope.gradeNumbers[x] : " + $scope.gradeNumbers[x])
                console.log("selectedUserGrades[i] nume : " + selectedUserGrades[i].nume + " >> selectedUserGrades[i] nota : " + selectedUserGrades[i].nota)
                selectedUserGrades[i].nota = $scope.gradeNumbers[x];
                selectedUserGrades[i].status = $scope.gradeNumbers[x];
                $("#selectedUserSubjectGrade-" + customId).val(x);
                selectedUserGrades[i].validated = true;
                selectedUserGrades[i].editing = false;
                $scope.gradesArray[i].editing = false;
                $scope.gradesArray[i].validated = true;
                console.log("selectedUserGrades[i] nota : " + selectedUserGrades[i].nota + " >> data : " + selectedUserGrades[i].data + " >> user : " + selectedUserGrades[i].user +
                    " >> validated : " + selectedUserGrades[i].validated + " >> editing : " + selectedUserGrades[i].editing + " >> uid : " + selectedUserGrades[i].uid)
                return $http.put('/api/users/grades/' + $scope.selectedUser._id, selectedUserGrades[i]).success(function(data) {
                    console.log("assignGrade data : ", data);
                    $scope.disableAddRow = false;
                });
                break;
            }
        }
    };





    // function called when the button EDIT from the template is pressed
    // this is used to show the edit/delete button and to make a dropdown list from the grade.
    $scope.editGrade = function(customId) {
        console.log("$scope.edit customId : " + customId)
        $scope.disableAddRow = true;
        for (var i = 0; i < selectedUserGrades.length; i++) {
            if (selectedUserGrades[i].customId == customId) {
                selectedUserGrades[i].validated = false;
                selectedUserGrades[i].editing = true;
                $scope.gradesArray[i].editing = true;
                $scope.gradesArray[i].validated = false;
                break;
            }
        }
    }

    $scope.cancelEdit = function(customId) {
        console.log("$scope.cancelEdit customId : " + customId)
        $scope.disableAddRow = false;
        for (var i = 0; i < selectedUserGrades.length; i++) {
            if (selectedUserGrades[i].customId == customId) {
                selectedUserGrades[i].validated = true;
                selectedUserGrades[i].editing = false;
                $scope.gradesArray[i].editing = false;
                $scope.gradesArray[i].validated = true;
                break;
            }
        }
    }

    // this function is called whenever the Add Row button is pressed
    // it creates a new object which is inserted in the array that is used to store the grades
    $scope.addRow = function() {
        console.log("$scope.addRow");
        $scope.toInsert = {
            uid: "" + selectedUserGrades.length + 1,
            customId: selectedUserGrades.length + 1,
            nume: null,
            nota: null,
            data: $scope.today,
            user: $scope.selectedUser._id,
            status: 1,
            validated: false,
            editing: false
        };
        console.log("$scope.addRow object to insert",$scope.toInsert);
        selectedUserGrades.push($scope.toInsert);
        $scope.disableAddRow = true;
    };

    // this function is called whenever the Remove Row button is pressed
    $scope.removeRow = function(index) {
        console.log("$scope.removeRow index : " + index + " >>>> selectedUserGrades[index] name: " + selectedUserGrades[index])
        console.log("$scope.removeRow $scope.selectedUser._id : " + $scope.selectedUser._id)

        return $http.put('/api/users/grades/delete/' + $scope.selectedUser._id, selectedUserGrades[index]).success(function(data) {
            console.log("deleted correctly",data);
            $scope.disableAddRow = false;
            selectedUserGrades.splice(index, 1);
        });
    };

    // this function computes the users grades that will be shown in the table
    function computeSelectedUserGrades() {
        console.log("computeSelectedUserGrades")
        for (var i = 0; i < $scope.grades.length; i++) {
            console.log("$scope.grades[i].nota " + $scope.grades[i].data);

            var myObj = {
                uid: $scope.grades[i]._id,
                customId: selectedUserGrades.length + 1,
                nume: $scope.grades[i].name,
                nota: $scope.grades[i].nota,
                data: $scope.grades[i].data,
                user: $scope.grades[i].user,
                status: $scope.grades[i].nota,
                validated: true,
                editing: false
            };
            $("#selectedUserSubjectGrade-" + myObj.customId).text("" + ($scope.grades[i].nota));
            selectedUserGrades.push(myObj);
        }
        console.log("selectedUserGrades[1] >> ",selectedUserGrades[1])
    }


    // this function computes the names for the grades that can be assigned by the teacher. there names are for the subjects to which the student registered
    // and whose teacher is the current one that's doing the editing
    function computeGradesNames() {
        console.log("computeGradesNames : " + usersClasses.data)
        for (var i = 0; i < usersClasses.data.length; i++) {
            console.log("usersClasses.data[i].subject : ",usersClasses.data[i].subject)
            $scope.gradesNames.push(usersClasses.data[i].subject);
        }
        console.log("computeGradesNames $scope.gradesNames",$scope.gradesNames)
    }

    //this function is used to compute the current day that will be used when a new grade is assigned to the user.
    function computeToday(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        $scope.today = dd + '.' + mm + '.' + yyyy;
    }

}