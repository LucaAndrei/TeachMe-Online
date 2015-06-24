$(document).ready(function(){
	var onValidateQ = jQuery.Event();
	onValidateQ.type = "onValidateQuiz";
	var butVerifica;
	var butReset;
	$(".quiz_radio").each(function(index){
		$.fn.initQuizRadio = function(){
			$(this).children(".container_answers").randomize("div.answer");
			butVerifica = $(this).children(".container_answers").children("#butVerifica");
			butReset = $(this).children(".container_answers").children("#butReset");
			butVerifica.parent().append(butVerifica);
			butReset.parent().append(butReset);

			var quiz = $(this);
			var radioList = $(this).find(".radio");

			radioList.on("click",function(){
				radioList.each(function(index){
					if ($(this).hasClass("gresit")) {
						$(this).removeClass("gresit");
					}
					if ($(this).hasClass("selected")) {
						$(this).removeClass("selected");
					}
				});
				var isSel = $(this).hasClass("selected");
				if (isSel == false){
					$(this).addClass("selected");
				}

				butVerifica.enable();
			});

			butVerifica.on("click", function(){
				if ($(this).isEnabled()){
					$(this).disable();
					var rsel = $(".selected");
					rsel.each(function(index){
						var grup = parseInt($(this).attr("grup"));
						if ($(this).attr("value") == "true"){
							//console.log("on correct")
							$(this).addClass("corect");
							cgrup = $(this).attr("grup");
							$('.radio[grup="'+cgrup+'"]').each(function(){
								$(this).off("click");
							});
							onValidateQ.valid = true;
							butReset.disable();
						}else{
							$(this).addClass("gresit");
							onValidateQ.valid = false;
							butReset.enable();
						}
					});//end rsel.each
					quiz.parent().trigger(onValidateQ);
				}
			});//end .valideaza.on

			butReset.on("click", function(){
				if ($(this).isEnabled()){
					$(this).disable();
					butVerifica.disable();
					quiz.resetQuizRadio();
				}
			});
		};

		$.fn.solveQuizRadio = function(){
			butReset.disable();
			var answers = $(this).children(".container_answers").children(".answer").children(".radio");
			answers.each(function(index){
				$(this).off("click");
				if ($(this).attr("value") == "true"){
					$(this).parent().css("color","#4cae4c")
				}
			});
		}

		$.fn.resetQuizRadio = function(){
			var answers = $(this).children(".container_answers").children(".answer").children(".radio");
			answers.each(function(index){
				$(this).removeClass("gresit");
				$(this).removeClass("selected");
			});
		}

		$.fn.blockQuizRadio = function(){
			var answers = $(this).children(".container_answers").children(".answer").children(".radio");
				answers.each(function(index){
				$(this).off("click");
			});
		}
		$.fn.unblockQuizRadio = function(){
			var answers = $(this).children(".container_answers").children(".answer").children(".radio");
			answers.on("click",function(){
				answers.each(function(index){
					if ($(this).hasClass("gresit")) {
						$(this).removeClass("gresit");
					}
					if ($(this).hasClass("selected")) {
						$(this).removeClass("selected");
					}
				});
				var isSel = $(this).hasClass("selected");
				if (isSel == false){
					$(this).addClass("selected");
				}

				butVerifica.enable();
			});
		}

	});
});//end window.load

(function($) {
	$.fn.randomize = function(childElem) {
	  return this.each(function() {
		  var $this = $(this);
		  var elems = $this.children(childElem);
		  elems.sort(function() { return (Math.round(Math.random())-0.5); });
		  $this.remove(childElem);
		  for(var i=0; i < elems.length; i++)
			$this.append(elems[i]);
	  });
	}
})(jQuery);