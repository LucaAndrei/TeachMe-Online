$(function() {
	$('.page-scroll a').bind('click', function(event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top - 110
		}, 1500, 'easeInOutQuad');
		event.preventDefault();
	});
});

$("body").on("input propertychange", ".floating-label-form-group", function(e) {
	$(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
});