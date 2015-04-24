/*Since we are making a single page application and we don’t want any page refreshes, we’ll use Angular’s routing capabilities.

Let’s look in our Angular file and add to our application. We will be using $routeProvider in Angular to handle our routing.
This way, Angular will handle all of the magic required to go get a new file and inject it into our layout.

Tutorial luat de pe : http://scotch.io/tutorials/javascript/single-page-apps-with-angularjs-routing-and-templating

Pentru documentatie, vezi ce e scris in acest site.



A RESOLVE is a property you can attach to a route in both ngRoute and the more robust UI router. A resolve contains one or more promises that must resolve
successfully before the route will change. This means you can wait for data to become available before showing a view, and simplify the initialization
of the model inside a controller because the initial data is given to the controller instead of the controller needing to go out and fetch the data.


Resolve - te ajuta sa-ti iei info din BD inainte sa intre in controller, ca in controller sa poti sa le folosesti
		- asteapta sa primeasca tot de la promise si abia apoi trece la controller cu toate info gata furnizate
		- sincron
		- se pot crea functii, obiecte, ce mai ai nevoie => in controller ai obiectele deja facute si le poti folosi direct
promise - asincron

*/
'use strict';
var calendar_controller = function($scope, $http, $state, $rootScope, $timeout,calendar_events){
    console.log("CalendarController.js");
   	$scope.userCredentials = userCredentials;

    var today;

    computeToday();
    initCalendar(calendar_events.data);

    var DEBUG = true;



	function initCalendar(myEvents){
		console.log("document ready, init calendar : " + today);
		$('#calendar').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'//month,agendaWeek,agendaDay
				},
				defaultDate: today,
				selectable: true,
				selectHelper: true,
				select: addEventFunction,
				editable: false,
				eventLimit: true, // allow "more" link when too many events
				events: myEvents,
				eventClick: function(calEvent, jsEvent, view){
		              alert(calEvent.title);
		        }
			});
		$("#loading").hide();
	}



	function addEventFunction (start, end) {
        console.log("is it here??");
		var title = prompt('Event Title:');
		if (title) {
			var event = {title : title,start : start, end : end};
			$http.put('/api/users/users/events',event).success(function(data){
				console.log("data",data)

				$("#msg-correct").css("display","block");
				setTimeout(function(){
					$("#msg-correct").css("display","none");
				},2000);
				event._id = data._id;
				$('#calendar').fullCalendar('renderEvent', event, true); // stick? = true
				$('#calendar').renderTheView();
			});
		}
		$('#calendar').fullCalendar('unselect');
	}

	deleteEventById = function(eventId){
		console.log("eventId : " + eventId.eventId);
		return $http.put('/api/users/users/events/delete',eventId).success(function(data){
			console.log("correctly deleted");
			$("#msg-delete").css("display","block");
			setTimeout(function(){
				$("#msg-delete").css("display","none");
			},2000);
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

	function computeToday(){
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth();
		curr_month++;
		var curr_year = d.getFullYear();
		console.log("curr_month : " + curr_month)
		if(curr_month < 10){
			today = curr_year + "-0" + curr_month + "-" + curr_date;
		} else {
			today = curr_date + "-" + curr_month + "-" + curr_year;
		}
	}


}

//The method from fullcalendar.js calls this method first and this method calls the one from the controller.
function deleteEventById(id){
	console.log("scope delete : " + id)
	calendardElevController.deleteEventById(id);
}
function refreshPage($route){
		console.log("refreshPage")
		$route.reload();
		console.log("asd")
		//location.reload();
	}