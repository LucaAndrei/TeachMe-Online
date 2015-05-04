$(document).ready(function(){
	$("button").each(function(){
		$.fn.disable = function() {
			console.log(">>>>>>>>>>> disable")
			$(this).addClass("disabled").children().addClass("disabled");
		}
		$.fn.enable = function() {
			console.log("enable")
			$(this).removeClass("disabled").children().removeClass("disabled");
		}
		$.fn.isEnabled = function(){
			console.log("is enabled")
			return !$(this).hasClass("disabled");
		}
	});
});