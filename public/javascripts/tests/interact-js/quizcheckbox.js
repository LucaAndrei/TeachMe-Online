$(document).ready(function(){
	var onValidateQ = jQuery.Event();
	onValidateQ.type = "onValidateQuiz";
	var butVerifica;
	var butReset;

	$(".quizcheckbox").each(function(index){
		$.fn.initQuizCheck = function(){

			var quiz = $(this);
			var checkList = $(this).find(".check");
			var nrRaspunsuriCorecte =  $(this).find('.check[value="true"]').length;//$('.check[value="true"]').length;
			var nrRaspunsuriSelectate = 0;

			butVerifica = $(this).children(".container_answers").children("#butVerifica");
			butReset = $(this).children(".container_answers").children("#butReset");

			$(this).children(".container_answers").randomize("div.answer");
			butVerifica.parent().append(butVerifica);
			butReset.parent().append(butReset);

			checkList.each(function(index){
				$(this).attr("blocat","false");
			});
			checkList.on("click",function(){
				if ($(this).attr("blocat")=="true"){
					return;
				}
				if ($(this).hasClass("gresit")){
					$(this).removeClass("gresit");
				}
				var isSel = $(this).hasClass("selected");
				if (isSel == false){
					$(this).addClass("selected");
				}else{
					$(this).removeClass("selected");
				}
				nrRaspunsuriSelectate = 0;
				checkList.each(function(index){
					if ($(this).hasClass("selected")){
						nrRaspunsuriSelectate++;
					}
				});
				if (nrRaspunsuriSelectate != 0)	{
					butVerifica.enable();
				}else{
					butVerifica.disable();
				}
			});

			butVerifica.on("click", function(){
				if ($(this).isEnabled()){
					$(this).disable();
					var rsel = quiz.find(".selected");

					rsel.each(function(index){
						var grup = parseInt($(this).attr("grup"));
						if ($(this).attr("value") == "true"){
							$(this).addClass("corect");
							$(this).attr("blocat","true");
							//$(this).off("click");
						}else{
							$(this).addClass("gresit");
					}
					});//end rsel.each
					nrRaspunsuriSelectateCorect = 0;
					nrRaspunsuriSelectateGresit = 0;
					checkList.each(function(index){
						if ($(this).hasClass("corect")){
							nrRaspunsuriSelectateCorect++;
						}
					});
					checkList.each(function(index){
						if ($(this).hasClass("gresit")){
							nrRaspunsuriSelectateGresit++;
						}
					});
					if (nrRaspunsuriSelectateCorect==nrRaspunsuriCorecte && nrRaspunsuriSelectateGresit==0){
						onValidateQ.valid = true;
						checkList.each(function(index){
							$(this).off("click");
						});
						butReset.disable();
					}else{
						onValidateQ.valid = false;
						butReset.enable();
					}
					quiz.trigger(onValidateQ);
				}
			});//end .valideaza.on

			butReset.on("click", function(){
				if ($(this).isEnabled()){
					$(this).disable();
					butVerifica.disable();
					quiz.resetQuizCheck();
				}
			});
		};

		$.fn.solveQuizCheck = function(){
			butReset.disable();
			var answers = $(this).children(".container_answers").children(".answer").children(".check");
			answers.each(function(index){
				$(this).off("click");
				if ($(this).attr("value") == "true"){
					$(this).parent().css("color","#669900")
				}
			});
		}

		$.fn.resetQuizCheck = function(){
			var answers = $(this).children(".container_answers").children(".answer").children(".check");
			answers.each(function(index){
				$(this).attr("blocat","false");
				$(this).removeClass("corect");
				$(this).removeClass("gresit");
				$(this).removeClass("selected");
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