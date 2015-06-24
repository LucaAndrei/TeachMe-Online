$(document).ready(function(){
	initQuiz(1);
	navigare();
});

var pas = 1;
var nrQuiz = 2;
var ended = false;

function initQuiz(id){
	console.log("initQuiz"+id);
	var quiz = document.getElementById("quiz1"+id);
	$("#quizContainer"+id).css('display','block');

	$(quiz).initQuizCheck();

	$("#quizContainer"+id).animate({left:'0px'}, 500);

	$("#quizContainer"+id).on("onValidateQuiz", function(evt){
		if (evt.valid){
			$(this).removeClass("quizContainer_incorrect");
			$(this).addClass("quizContainer_correct");
			console.log("correct")
			setTimeout(function(){onEndQuiz(id);},1500);
		}else{
			$(this).addClass("quizContainer_incorrect");

		}

		//console.log("Ai validat "+evt.valid+" drag-ul "+evt.id+". Trase "+evt.nrTrase+" / "+evt.nrDropuri);
	});
}

function onEndQuiz(id){
	console.log("on end quiz")
	if (id==nrQuiz){
		ended = true;
		$("#butPrev").enable();
	}else{
		$("#butNext").enable();
	}
	$("#quizContainer"+id).off("onValidateQuiz");
}


function navigare(){
	console.log("navigare")
	$("#butNext").disable();
	$("#butPrev").disable();

	$("#butNext").on("click", onNext);
	$("#butPrev").on("click", onPrev);

	function onNext(){
		console.log("on next")
		if ($("#butNext").isEnabled()){
			console.log("click #butNext");
			$("#butNext").disable();
			$("#butPrev").disable();
			if (!ended){
				$("#quizContainer"+pas).animate({left:'-1400px'}, 500);
				pas++;
				initQuiz(pas);
			}else{
				$("#quizContainer"+pas).animate({left:'-1400px'}, 500);
				pas++;
				$("#quizContainer"+pas).animate({left:'0px'}, 500, function(){
					activateButtons();
				});
			}

		}
	};

	function onPrev(){
		if ($("#butPrev").isEnabled()){
			//log("click #butPrev");
			$("#butNext").disable();
			$("#butPrev").disable();

			$("#quizContainer"+pas).animate({left:'1400px'}, 500);
			pas--;
			$("#quizContainer"+pas).animate({left:'0px'}, 500, function(){
				activateButtons();
			});
		}
	};

	function activateButtons(){
		if (pas==nrQuiz){
			$("#butNext").disable();
			$("#butPrev").enable();
		}else if (pas==1){
			$("#butPrev").disable();
			$("#butNext").enable();
		}else{
			$("#butPrev").enable();
			$("#butNext").enable();
		}
	}
}