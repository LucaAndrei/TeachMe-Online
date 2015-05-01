$(document).ready(function(){
start();
});
$(document).mousemove(function(event){ 
        $("#myspan").text("X: " + event.pageX + ", Y: " + event.pageY); 
    });

//setup stage
function start(){
	//log("start");
	//add some background

	//navigare();
	//initDndQuiz(1);
	//$("#butNext").enable();


	initQuiz(1);



}

var incercariGresite=0;
var maxIncercari=0;
//maxIncercari - numarul maxim de incercari gresite dupa care apare solutia pe parcurs per total(0 - nelimitat)

function initQuiz(id){
	//log("initQuiz"+id);
	var quiz = document.getElementById("quiz1"+id);
	$("#quizContainer"+id).css('display','block');
	$(quiz).initQuizDndAsim(maxIncercari);
	//$("#quizContainer"+id).animate({left:'25px'}, 500);
			
	incercariGresite = 0;
	$("#quizContainer"+id).on("onValidateQuiz", function(evt){
		if (evt.valid){
			$(this).removeClass("quizContainer_incorrect");
			$(this).addClass("quizContainer_correct");
			if (evt.end) setTimeout(function(){onEndQuiz(id);},1500);
		}else{
			incercariGresite++;
			$(this).addClass("quizContainer_incorrect");
			if (incercariGresite==maxIncercari){
				onEndQuiz(id);
			}
		}

		console.log("Ai validat "+evt.valid+" drag-ul "+evt.id+". Trase "+evt.nrTrase+" / "+evt.nrDropuri);
	});
}


function onEndQuiz(id){
	if (id==1){
		API.info("finish");
	}
}



/*

var incercari=0;
function initDndQuiz(id){
	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> INIT DND QUIZ")
	//API.info("todo1");
	var quiz = document.getElementById("quiz1"+id);
	//$("#quiz1"+id).css('display','block');
	$(quiz).initQuizDnd("quiz1"+id);
	//$("#quiz1"+id).animate({left:'25px'}, 500);

	incercari = 0;
	$("#quiz1"+id).on("onValidateQuiz", function(evt){
		if (evt.valid){
			//$(this).removeClass("quizContainer_incorrect");
			//$(this).addClass("quizContainer_correct");
			if (evt.end) setTimeout(function(){onEndDndQuiz(id);},1500);
		}else{
			//$(this).addClass("quizContainer_incorrect");
		}

		//log("Ai validat "+evt.valid+" drag-ul "+evt.id+". Trase "+evt.nrTrase+" / "+evt.nrDropuri);
	});
}

function onEndDndQuiz(id){
	//API.info("todo4");
	$("#titlu1").css("display","none");
	$("#titlu2").css("display","block");
	$("#subtitlu2").css("display","block");
	$("#qMark").css("display","block");
	$("#quizContainer1").css("background","url(javascripts/tests/assets/image/background2.jpg)");
	$("#quiz11").css("display","none");
	for(var i = 1; i<=10;i++){
		$("#text"+i).css("display","block");
	}
	$("#qMark").on("mousedown",clickQMark);
}
function clickQMark(){
	$("#qMark").off("mousedown",clickQMark);
	initRadioQuiz(2);
	incercari = 0;
}

function initRadioQuiz(id){
	var quiz = document.getElementById("quiz1"+id);
	$("#quizContainer"+id).css('display','block');
	//API.info("todo5");
	$(quiz).initQuizRadio();
	$("#quiz1"+id).animate({left:'185px'}, 500);

	incercari=0;
	$("#quiz1"+id).on("onValidateQuiz", function(evt){
		if (evt.valid){
			//API.info("todo3");
			$(this).removeClass("quizContainer_incorrect");
			$(this).addClass("quizContainer_correct");
			//playSound("correct", null);
			setTimeout(function(){onEndRadioQuiz(id);},2500);
		}else{
			incercari++;
			if (incercari==1 || incercari==2){
				$(this).addClass("quizContainer_incorrect");
				//API.info("todo2");
				//playSound("wrong", null);
			}else{
				//API.info("todo6");
				$(quiz).solveQuizRadio();
				setTimeout(function(){onEndRadioQuiz(id);},2500);
			}
		}
	});
}
function onEndRadioQuiz(id){
	$("#quiz12").animate({left:'-700px'}, 300);
	incercari = 0;
	setTimeout(function(){
		initCheckQuiz(3);
	},500);

}


function initCheckQuiz(id){
	//API.info("todo7");
	var quiz = document.getElementById("quiz1"+id);
	$("#quiz1"+id).css('display','block');
	$(quiz).initQuizCheck();
	$("#quiz1"+id).animate({left:'185px'}, 500);

	incercari=0;
	$("#quiz1"+id).on("onValidateQuiz", function(evt){
		if (evt.valid){
			//API.info("todo3");
			$(this).removeClass("quizContainer_incorrect");
			$(this).addClass("quizContainer_correct");
			//playSound("correct", null);
			setTimeout(function(){onEndCheckQuiz(id);},2500);
		}else{
			incercari++;
			if (incercari==1 || incercari==2){
				$(this).addClass("quizContainer_incorrect");
				//API.info("todo2");
				//playSound("wrong", null);
			}else{
				//API.info("todo6");
				$(quiz).solveQuizCheck();
				setTimeout(function(){onEndCheckQuiz(id);},2500);
			}
		}
	});
}

function onEndCheckQuiz(id){
	//API.info("todo8");
	$("#butNext").enable();
}

function initQuiz(id){
	if(!ended){
		//API.info("todo9");
		$("#quizContainer2").animate({left:'0px'}, 500);
		for(var i=1;i<=4;i++){
			$("#numar"+i).on("mousedown",numarClick);
		}
	}
}
var contor = 0;
function numarClick(evt){
	var thisID = $(this).attr("id").split("numar")[1];
	$("#numar"+thisID).off("mousedown",numarClick);
	$("#textNumar"+thisID).css("display","block");
	$(this).css("background","url(javascripts/tests/assets/image/b_2.png)");
	contor++;
	if(contor == 4){
		//API.info("todo10");
		$("#tabel").css("display","block")
		$("#butPrev").enable();
		ended = true;
	}
}



var pas = 1;
var nrQuiz = 2;
var ended = false;
function navigare(){
	$("#butNext").disable();
	$("#butPrev").disable();

	$("#butNext").on("click", onNext);
	$("#butPrev").on("click", onPrev);

	function onNext(){
		if ($("#butNext").isEnabled()){
			//log("click #butNext");
			$("#butNext").disable();
			$("#butPrev").disable();
			if (!ended){
				$("#quizContainer"+pas).animate({left:'-700px'}, 500);
				pas++;
				initQuiz(pas);
			}else{
				$("#quizContainer"+pas).animate({left:'-700px'}, 500);
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

			$("#quizContainer"+pas).animate({left:'700px'}, 500);
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


*/