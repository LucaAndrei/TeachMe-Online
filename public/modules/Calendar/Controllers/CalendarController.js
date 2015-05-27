'use strict';
var calendar_controller = function($scope, $http, $state, $rootScope, $timeout, calendar_events) {
    //console.log("CalendarController.js");
    $scope.userCredentials = userCredentials;

    var today;

    computeToday();
    initCalendar(calendar_events.data);

    var DEBUG = true;
    $scope.error_time = false;
    $scope.error_nume_event = false;
    var currentDate;
    var startTime;
    var endTime;



    function initCalendar(myEvents) {
        console.log("init calendar",myEvents)
        var calendar = $("#calendar");
        console.log("CALENDAR",calendar)
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay' //month,agendaWeek,agendaDay
            },
            //defaultDate: today,
            ignoreTimezone: false,
            timezone:'local',
            selectable: true,
            selectHelper: true,
            select: addEventFunction,
            editable: false,
            eventLimit: true, // allow "more" link when too many events
            events: myEvents,
            eventClick: function(calEvent, jsEvent, view) {
                //alert(calEvent.title);
                console.log(calEvent);
                console.log(calEvent._start.hours())
                console.log(calEvent._start.minutes())
                 console.log(calEvent._end.hours())
                console.log(calEvent._end.minutes())
                if(calEvent._start.hours() < 10){
                    if(calEvent._start.minutes()<10){
                        if(calEvent._start.minutes()==0){
                            $("#event_start").text("0" + calEvent._start.hours() + ":00");
                        } else {
                            $("#event_start").text("0" + calEvent._start.hours() + ":0" + calEvent._start.minutes());
                        }
                    } else {
                        $("#event_start").text("0" + calEvent._start.hours() + ":" + calEvent._start.minutes());
                    }
                } else {
                    if(calEvent._start.minutes()<10){
                        if(calEvent._start.minutes()==0){
                            $("#event_start").text("" + calEvent._start.hours() + ":00");
                        } else {
                            $("#event_start").text("" + calEvent._start.hours() + ":0" + calEvent._start.minutes());
                        }
                    } else {
                        $("#event_start").text("" + calEvent._start.hours() + ":" + calEvent._start.minutes());
                    }
                }
                if(calEvent._end.hours() < 10){
                    if(calEvent._end.minutes()<10){
                        if(calEvent._end.minutes()==0){
                            console.log("HERE")
                            $("#event_end").text("0" + calEvent._end.hours() + ":00");
                        } else {
                            $("#event_end").text("0" + calEvent._end.hours() + ":0" + calEvent._end.minutes());
                        }
                        $("#event_end").text("0" + calEvent._end.hours() + ":0" + calEvent._end.minutes());
                    } else {
                        $("#event_end").text("0" + calEvent._end.hours() + ":" + calEvent._end.minutes());
                    }
                } else {
                    if(calEvent._end.minutes()<10){
                        if(calEvent._end.minutes()==0){
                            $("#event_end").text("" + calEvent._end.hours() + ":00");
                        } else {
                            $("#event_end").text("" + calEvent._end.hours() + ":0" + calEvent._end.minutes());
                        }
                    } else {
                        $("#event_end").text("" + calEvent._end.hours() + ":" + calEvent._end.minutes());
                    }
                }
                $("#eventTitle").text("" + calEvent.title)
                $("#eventDescriere").text("" + calEvent.descriere)
                $('#class_modal').modal('show')
            },
            dayClick: function(date, jsEvent, view){
                currentDate = date.format();
            }
        });
        $("#loading").hide();
    }



    function addEventFunction(start, end) {
        console.log("addEventFunction : " + start + ">>" + end)
        console.log("currentDate : " + currentDate)
        $('#eventName').val("");
        $('#descriptionEvent').val("");
        $('#modal_add_event').modal('show');
    }

    $scope.saveEvent = function() {
        var start_time_hour = parseInt($('#start_time').val().split(":")[0]);
        var end_time_hour = parseInt($('#end_time').val().split(":")[0]);
        var start_time_minutes = parseInt($('#start_time').val().split(":")[1]);
        var end_time_minutes = parseInt($('#end_time').val().split(":")[1]);


        var clickedYear = currentDate.split("-")[0];
        var clickedMonth = currentDate.split("-")[1];
        var clickedDay = currentDate.split("-")[2];
        startTime = new Date(clickedYear,clickedMonth - 1,clickedDay,start_time_hour,start_time_minutes);
        endTime = new Date(clickedYear,clickedMonth - 1,clickedDay,end_time_hour,end_time_minutes);

        console.log("startTime : " + startTime)
        console.log("endTime : " + endTime)

        if ($('#eventName').val() == "") {
            $scope.error_nume_event = true;
        } else {
            $scope.error_nume_event = false;
        }
        if (start_time_hour < end_time_hour) {
            $scope.error_time = false;
        }
        if (start_time_hour > end_time_hour) {
            $scope.error_time = true;
        } else if ((start_time_hour < end_time_hour) && ($('#eventName').val() != "")) {
            $scope.error_time = false;
            $scope.error_nume_event = false;
            addNewEvent()
        } else if (end_time_hour == start_time_hour) {
            if ((start_time_minutes < end_time_minutes) && $('#eventName').val() != "") {
                addNewEvent()
            } else {
                $scope.error_time = true;
            }
        }
    }


    function addNewEvent() {

        var event = {
            title: '' + $('#eventName').val(),
            start: startTime,
            end: endTime,
            descriere: '' + $('#descriptionEvent').val()
        };
        console.log("event",event.start)
        $http.put('/api/users/events', event).success(function(data) {
            console.log("success add event data",data);
                $("#msg-correct").css("display", "block");
                setTimeout(function() {
                    $("#msg-correct").css("display", "none");
                }, 2000);
                event._id = data._id;
                $('#calendar').fullCalendar('renderEvent', event, true); // stick? = true
                $('#calendar').renderTheView();
                $('#modal_add_event').modal('hide');
            });
        $('#calendar').fullCalendar('unselect');
    }

    deleteEventById = function(eventId) {
        return $http.put('/api/users/events/delete', eventId).success(function(data) {
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