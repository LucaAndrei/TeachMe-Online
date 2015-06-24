$(document).ready(function(){
	var onValidateQ = jQuery.Event();
	onValidateQ.type = "onValidateQuiz";

	var dragCurent = null;
	var tmpEl;
	var nrDraguri;
	var nrDropuri;
	var dragsGap = 10;
	var quiz;
	var nrTrase = 0;
	var butVerifica;
	var dw;
	var dh;
	var idx;
	var col_corect = "#669900"
	var col_gresit = "#FF3300"
	var col_default = "#000000"
	var coords=[];
	var asimilare;
	var dragList;
	var dropList;
	$(".quiz_dnd").each(function(index){
		//log($(this).attr("id"));
		$.fn.initQuizDnd = function(){
			coords=[];
			asimilare = $(this).attr("asimilare");
			butVerifica = $(this).children(".container_answers").children(".valideaza");
			butVerifica.on("click",verificare);

			dragsWidth = 0;
			quiz = $(this);
			idx = $(this).attr("idx");
			dragList = quiz.children(".container_answers").children("#dragContainer").find(".drag");
			dropList = quiz.children(".container_answers").children("#dropContainer").find(".drop[corect!='']");
			hDragContainer = quiz.children(".container_answers").children("#dragContainer").height();
			hDropContainer = quiz.children(".container_answers").children("#dropContainer").height();
			quiz.children(".container_answers").children("#dragContainer").css("height",hDragContainer);
			quiz.children(".container_answers").children("#dropContainer").css("height",hDropContainer);

			//log("hDragContainer="+hDragContainer);
			//log("hDropContainer="+hDropContainer);

			nrDraguri = dragList.length;
			nrDropuri = dropList.length;

			for(var i=nrDropuri; i>=1; i--){
				var drop = quiz.children(".container_answers").children("#dropContainer").find("#drop_"+idx+"_"+i);
				drop.attr("ocupat","");
				drop.attr("nr", i);
				drop.attr("green","false");
			}

			for(var i=nrDraguri; i>=1; i--){
				var drag = quiz.children(".container_answers").children("#dragContainer").find("#drag_"+idx+"_"+i);
				drag.attr("nr",i);
				drag.data("parent", drag.parent());
				drag.attr("drop","");
				var marginh = (drag.outerWidth(true) - drag.outerWidth(false)) / 2;
				var marginv = (drag.outerHeight(true) - drag.outerHeight(false)) / 2;
				coords.push({left:drag.position().left+marginh,top:drag.position().top+marginv});
				drag.removeClass("spacer");
				drag.on("mousedown", dragMouseDown);
			}
			//randomizare
			coords.sort(function(){return (Math.round(Math.random())-0.5);});
			for(var i=nrDraguri; i>=1; i--){
				var drag = quiz.children(".container_answers").children("#dragContainer").find("#drag_"+idx+"_"+i);
				//var drop = quiz.children(".container_answers").children("#dropContainer").find("#drop_"+idx+"_"+i);
				drag.data("init_top",coords[i-1].top);
				drag.data("init_left",coords[i-1].left + 8);
				drag.css({"position":"absolute",left:coords[i-1].left + 8,top:coords[i-1].top});
			}
			nrTrase = 0;
		};

		function dragMouseDown(event){
			////log("mouseDown");
			dragCurent = $(event.currentTarget);
			$("#applet").append(dragCurent);
			dw = dragCurent.width();
			dh = dragCurent.height();
			//var drop = dragCurent.attr("drop");
			var drop = quiz.children(".container_answers").children("#dropContainer").find("#drop_"+idx+"_"+dragCurent.attr("drop"))
			if (dragCurent.attr("drop")!=""){
				//log("id "+drop.attr("id"));
				drop.attr("drag","");
				drop.attr("ocupat","");
				dragCurent.attr("drop","");
				nrTrase--;
				if(nrTrase<nrDropuri){
					butVerifica.css("display", "none");
				}
			}
			dragCurent.css({"position":"absolute", "left":parseFloat(event.pageX-dragCurent.width()/2 - 410),"top":parseFloat(event.pageY-dragCurent.height()/2 - 180)});
			$("#applet").on("mousemove", appletMouseMove);
			$("#applet").on("mouseup", appletMouseUp);
			$("#applet").on("mouseleave", appletMouseLeave);
		}

		function appletMouseLeave(event){
			dragCurent.removeAttr("style");
			dragCurent.css({"position":"absolute","left":dragCurent.data("init_left"),"top":dragCurent.data("init_top")});
			dragCurent.data("parent").append(dragCurent);
			forceMouseUp();
		}

		function appletMouseUp(event){
			checkHitTest({x: event.pageX, y: event.pageY});
		}

		function appletMouseMove(event){
			dragCurent.css({left:event.pageX-dw/2 - 410,top:event.pageY-dh/2 - 180});
		}

		function forceMouseUp(){
			$("#applet").off("mousemove", appletMouseMove);
			$("#applet").off("mouseleave", appletMouseLeave);
			$("#applet").off("mouseup", appletMouseUp);
		}

		function checkHitTest(mousePoint){
			var g = false;
			for(var i=1; i<=nrDropuri; i++){
				var drop = quiz.children(".container_answers").children("#dropContainer").find("#drop_"+idx+"_"+i);
				if(objectHitPoint(drop, mousePoint)==true){
					if(drop.attr("ocupat") == ""){
						g = true;
						drop.attr("ocupat", true);
						drop.attr("drag", dragCurent.attr("nr"));
						dragCurent.attr("drop",i);
						drop.parent().append(dragCurent);
						var marginh = (drop.outerWidth(true) - drop.outerWidth(false)) / 2 + 8;
						var marginv = (drop.outerHeight(true) - drop.outerHeight(false)) / 2;
						dragCurent.css({"position":"absolute", "left":drop.position().left+marginh,"top":drop.position().top+marginv});
						if (asimilare=="true"){
							verificare_asimilare(dragCurent,drop);
						}else{
							nrTrase++;
							if(nrTrase==nrDropuri){
								butVerifica.css("display", "block");
								quiz.children(".container_answers").children("#dragContainer").height(0);
							}
						}
						break;
					}
				}
			}
			if (!g){
				quiz.children(".container_answers").children("#dragContainer").height(hDragContainer);
				dragCurent.removeAttr("style");
				dragCurent.css({"position":"absolute","left":dragCurent.data("init_left"),"top":dragCurent.data("init_top")});
				dragCurent.data("parent").append(dragCurent);
			}
			forceMouseUp();
		}

		function checkPointHitArea(left, point, right){
			if(point > left && point < right){
				return true;
			}else{
				return false;
			}
		}

		function objectHitPoint(obj, point) {
			if(checkPointHitArea(obj.offset().left, point.x, obj.offset().left + obj.width()) && checkPointHitArea(obj.offset().top, point.y, obj.offset().top + obj.height())){
				return true;
			}else{
				return false;
			}
		}

		function verificare_asimilare(dragCurent,drop){
			//log("******  verificare asimilare");
			onValidateQ.valid = false;
			var arr_cor = drop.attr("corect").split(",");
			//log(arr_cor+" => "+dragCurent.attr("nr"));
			if (arr_cor.indexOf(dragCurent.attr("nr"))==-1){
				drop.attr("drag","");
				drop.attr("ocupat","");
				dragCurent.attr("drop","");
				dragCurent.css({"color":col_gresit});
				quiz.blockQuizDnd();
				setTimeout(function(){
					quiz.unblockQuizDnd();
					dragCurent.css({"color":col_default});
					dragCurent.data("parent").append(dragCurent);
					dragCurent.css({"position":"absolute",top:dragCurent.data("init_top"),left:dragCurent.data("init_left")});
				},1500);
			}else{
				dragCurent.attr("corect","true");
				dragCurent.off("mousedown",dragMouseDown);
				dragCurent.css({"color":col_corect});
				onValidateQ.valid = true;
				nrTrase++;
			}

			onValidateQ.id = dragCurent.attr("id");
			onValidateQ.nrTrase = nrTrase;
			onValidateQ.nrDropuri = nrDropuri;

			if (nrTrase==nrDropuri)	{
				onValidateQ.end = true;
				quiz.children(".container_answers").children("#dragContainer").hide();
				quiz.blockQuizDnd();
			}else{
				onValidateQ.end = false;
			}

			quiz.parent().trigger(onValidateQ);
		}

		function verificare(){
			$(this).css("display", "none");
			for(var i=1; i<=nrDropuri; i++){
				var drop = quiz.children(".container_answers").children("#dropContainer").find("#drop_"+idx+"_"+i);
				var drag = quiz.children(".container_answers").children("#dropContainer").find("#drag_"+idx+"_"+drop.attr("drag"));
				if (drop.attr("corect").split(",").indexOf(drop.attr("drag"))==-1){
					drop.attr("drag","");
					drop.attr("ocupat","");
					drag.attr("drop","");
					drag.css({"color":col_gresit});
					nrTrase--;
				}else{
					if(drop.attr("green")!="true"){
						drag.css({"color":col_corect});
						drop.attr("green","true");
					}
				}
			}

			dragList.each(function(){
				$(this).off("mousedown",dragMouseDown);
			});

			//log(nrTrase+" == "+nrDropuri);
			if (nrTrase==nrDropuri)	{
				onValidateQ.valid = true;
				onValidateQ.end = true;
				quiz.children(".container_answers").children("#dragContainer").hide();
				quiz.blockQuizDnd();
			}else{
				onValidateQ.valid = false;
				onValidateQ.end = false;
			}
			quiz.parent().trigger(onValidateQ);
		}

		$.fn.resetQuizDnd = function(){
			quiz.children(".container_answers").children("#dragContainer").height(hDragContainer);
			var dragList = quiz.children(".container_answers").find(".drag[drop='']");
			dragList.each(function(){
				$(this).on("mousedown",dragMouseDown);
				$(this).css({"color":col_default});
				$(this).data("parent").append($(this));
				$(this).css({"position":"absolute",top:$(this).data("init_top"),left:$(this).data("init_left")});
			});
		}

		$.fn.blockQuizDnd = function(){
			var dragList = quiz.children(".container_answers").find(".drag");
			dragList.each(function(){
				$(this).off("mousedown",dragMouseDown);
			});
		}

		$.fn.unblockQuizDnd = function(){
			var dragList = quiz.children(".container_answers").find(".drag");
			dragList.each(function(){
				if ($(this).attr("corect")!="true"){
					$(this).on("mousedown",dragMouseDown);
				}
			});
		}

		$.fn.solveQuizDnd = function(){
			quiz.children(".container_answers").children("#dragContainer").hide();

			var dropCont = quiz.children(".container_answers").children("#dropContainer");
			var contAns = quiz.children(".container_answers");

			contAns.find(".drag[drop='']").each(function(){
				$(this).data("parent").append($(this));
				$(this).css({"color":col_default});
			})

			dropList.each(function(){
				if ($(this).attr("green")=="false"){
					var corArr = $(this).attr("corect").split(",");
					for(var i=0; i<corArr.length; i++){
						var dragGasit = quiz.children(".container_answers").find("#drag_"+idx+"_"+corArr[i]);

						if(dragGasit.attr("drop") == "" &&  $(this).attr("ocupat") == ""){
							$(this).parent().append(dragGasit);
							var marginh = ($(this).outerWidth(true) - $(this).outerWidth(false)) / 2 + 8;
							var marginv = ($(this).outerHeight(true) - $(this).outerHeight(false)) / 2;
							dragGasit.css({position:"absolute", top:$(this).position().top+marginv, left:$(this).position().left+marginh});
							dragGasit.attr("drop",$(this).attr("nr"));
							$(this).attr("drag",corArr[i]);
							$(this).attr("ocupat","true");
						}
					}
				}
			});
		}
	});
});//end document.ready