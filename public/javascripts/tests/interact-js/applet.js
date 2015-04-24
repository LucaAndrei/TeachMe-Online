$(document).ready(function(){
start();
});

var stage1 = null;
var canvas1 = null;
var images = [];
var loaded = 0;
var sources;
var sunete;
var preload;


var background_bmp;
var snd;

function init(){
	console.log("!@@!!@!@#!#@#@!@#@!$@##@%@#%@#%@%@init");

	canvas1 = document.getElementById("stage1");
	canvas1.width = 700;
	canvas1.height = 520;

	stage1 = new StageX(canvas1);
	stage1.name = "STAGE1";

	sources = [
				{src:"javascripts/tests/assets/image/background1.jpg", id:"background"}
			  ];

	sunete = [
				"javascripts/tests/assets/audio/correct.mp3",
				"javascripts/tests/assets/audio/wrong.mp3"
			  ];
/*
	createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
	createjs.Sound.addEventListener("fileload", handleSoundLoad);
	for (var i = 0; i<sunete.length ; i++){
		createjs.Sound.registerSound(sunete[i], sunete[i].substring(sunete[i].lastIndexOf("/")+1,sunete[i].lastIndexOf(".")));
	}
*/
	preload = new createjs.LoadQueue(false);
	preload.on("fileload", handleFileLoad);
	preload.on("complete",handleLoadComplete);
	preload.loadManifest(sources);
	//log("loadManifest");
}

function handleFileLoad(event){
	var item = event.item; // A reference to the item that was passed in to the LoadQueue
	var type = item.type;
	if(type == "image"){
		var img = new Image();
		img.id = item.id;
		img.src = item.src;
		images.push(img);
		loaded++;
		//log("loadImage : "+item.id+" : "+ item.src+"("+loaded+"/"+(sources.length+sunete.length)+")");
	}
}
/*
function handleSoundLoad(event){
	if (event.id){
		createjs.Sound.createInstance(event.id);
		loaded++;
		//log("******* loadSound : "+event.id+" : "+event.src+"("+loaded+"/"+(sources.length+sunete.length)+")");
		handleLoadComplete(null);
	}
}
*/
function handleLoadComplete(event){
	if(loaded == sources.length+sunete.length){
		$("#ldd").remove();
		setupSprites();
		start();
		//log("active plugin : "+createjs.Sound.activePlugin);
	}
}

//setup sunet
/*
function playSound(id, onSndComplete){
	if (createjs.Sound.BrowserDetect.isIOS) createjs.WebAudioPlugin.playEmptySound();
	setTimeout(function(){
		stopSound();
		//API.openAudio();
		snd = createjs.Sound.play(id);
		snd.id = id;
		if (onSndComplete!=null){
			snd.onSndComplete = onSndComplete;
			snd.addEventListener("complete", onSndComplete);
		}
		snd.addEventListener("complete", stopSound);
	},1);
}

function stopSound(){
	if (snd){
		//API.closeAudio();
		snd.stop();
		snd.removeEventListener("complete", stopSound);
		if (snd.onSndComplete!=null){
			snd.removeEventListener("complete", snd.onSndComplete);
		}
	}
}
*/

//setup animatii
function setupSprites(){
	//test sprite

}

//setup stage
function start(){
	//log("start");
	//add some background
	//background_bmp = new Bitmap(getImageById("background"));
	//stage1.addChild(background_bmp);

	for(var i = 1; i<=10;i++){
		$("#text"+i).css("display","none");
		if(i<=4){
			$("#textNumar"+i).css("display","none");
		}
	}

	navigare();
	initDndQuiz(1);
	//$("#butNext").enable();

}



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
			//API.info("todo3");
			//$(this).removeClass("quizContainer_incorrect");
			//$(this).addClass("quizContainer_correct");
			//playSound("correct", null);
			if (evt.end) setTimeout(function(){onEndDndQuiz(id);},1500);
		}else{
			//API.info("todo2");
			//$(this).addClass("quizContainer_incorrect");
			//playSound("wrong", null);
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




/*playSound("correct", onSoundComplete);
function onSoundComplete(evt){
	log("onSoundComplete => "+snd.id);
	playSound("wrong", onSoundComplete);
}*/

function getImageById(val){
	for(var j=0; j<images.length; j++){
		if(images[j].id == val){
			return images[j];
			break;
		}
	}
	return null;
}


