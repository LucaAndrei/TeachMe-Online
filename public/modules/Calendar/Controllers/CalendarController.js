'use strict';
var calendar_controller = function($scope, $http, $state, $rootScope, $timeout, calendar_events) {
    //console.log("CalendarController.js");
    $scope.userCredentials = userCredentials;

    var today;

    computeToday();
    initCalendar(calendar_events.data);

    var DEBUG = true;



    function initCalendar(myEvents) {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay' //month,agendaWeek,agendaDay
            },
            defaultDate: today,
            selectable: true,
            selectHelper: true,
            select: addEventFunction,
            editable: false,
            eventLimit: true, // allow "more" link when too many events
            events: myEvents,
            eventClick: function(calEvent, jsEvent, view) {
                alert(calEvent.title);
            }
        });
        $("#loading").hide();
    }



    function addEventFunction(start, end) {
        var title = prompt('Event Title:');
        if (title) {
            var event = {
                title: title,
                start: start,
                end: end
            };
            $http.put('/api/users/users/events', event).success(function(data) {
                $("#msg-correct").css("display", "block");
                setTimeout(function() {
                    $("#msg-correct").css("display", "none");
                }, 2000);
                event._id = data._id;
                $('#calendar').fullCalendar('renderEvent', event, true); // stick? = true
                $('#calendar').renderTheView();
            });
        }
        $('#calendar').fullCalendar('unselect');
    }

    deleteEventById = function(eventId) {
        return $http.put('/api/users/users/events/delete', eventId).success(function(data) {
            $("#msg-delete").css("display", "block");
            setTimeout(function() {
                $("#msg-delete").css("display", "none");
            }, 2000);
            // TODO - ON RELOAD, THE PAGE RETURNS BY DEFAULT TO THE CURRENT DAY ON NOT ON THE DAY FROM WHICH THE DELETE WAS DONE
            // the page should reload with the date from which the delete was made. either save that date in a rootscope global
            // variable when the delete is made and render the full calendar with that date, or find another solution
            // so that on delete the div dissapears
            //$route.reload();
            //$("#"+eventId.eventId).parent().parent().parent().removeClass("fc-event-container");
            //$("#"+eventId.eventId).parent().parent().remove();
            $('#calendar').fullCalendar('removeEvents', eventId.eventId);
            //$state.go("root.calendar");
            //$scope.$apply();
        });
    }

    function computeToday() {
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        curr_month++;
        var curr_year = d.getFullYear();
        if (curr_month < 10) {
            today = curr_year + "-0" + curr_month + "-" + curr_date;
        } else {
            today = curr_date + "-" + curr_month + "-" + curr_year;
        }
    }


}

//The method from fullcalendar.js calls this method first and this method calls the one from the controller.
function deleteEventById(id) {
    calendardElevController.deleteEventById(id);
}

function refreshPage($route) {
    $route.reload();
    //location.reload();
}