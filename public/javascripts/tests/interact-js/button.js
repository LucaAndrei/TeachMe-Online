$(document).ready(function(){
	$("button").each(function(){
		$.fn.disable = function() {
			$(this).addClass("disabled").children().addClass("disabled");
		}
		$.fn.enable = function() {
			$(this).removeClass("disabled").children().removeClass("disabled");
		}
		$.fn.isEnabled = function(){
			return !$(this).hasClass("disabled");
		}
	});
});