(function (window) {
    // The class now receives parameters that are passed to the initalize() method (the constructor).
    var StageX = function(canvas){
		StageX.version = "0.14";
	    this.initialize(canvas);
    }
    var p = StageX.prototype = new Stage();

	//Stage.prototype._enableMouseEvents = function(){}
	
    p.Stage_initialize = p.initialize;
    p.Stage_tick = p.tick;
	
	p.onMouseLeave = null;

	p.width = 0;
	p.height = 0;
	p.mlx = 0;
	p.mly = 0;
	p.outside = false;
	
	//The initialize method register the class variables with the pased parameters
    p.initialize = function(canvas) {
		//o se refera la obiectul StageX
		this.Stage_initialize(canvas);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.enableMouseOver();
		Ticker.setFPS(30);
		Ticker.addListener(this);
		//Ticker.on("tick", this);

		var o = this;
	
		var appTarget = $(this.canvas.parentElement);
		appTarget.on('mouseleave',function(e){o._mLeave(e);});
		//Touch.enable(this);
		//Touch._handleTouchEnd = function(){};

		//utila pentru drag&drop
		DisplayObject.prototype.stayOnStage = function(){
			if (this.x >= o.width - this.width){
				this.x = o.width - this.width;
			}
			if (this.y >= o.height - this.height){
				this.y = o.height - this.height;
			}
			if (this.x <= 0){
				this.x = 0;
			}
			if (this.y <= 0){
				this.y = 0;
			}
		}
	}

	p._mLeave = function(e){
		this.mouseX = e.pageX;
		this.mouseY = e.pageY;
		var cond_inside = (e.pageX>=0 && e.pageX<=this.width && e.pageY>=0 && e.pageY<=this.height);
		if (e.pageX<=0 || e.pageX>=this.width || e.pageY<=0 || e.pageY>=this.height || cond_inside){
			this.outside = true;
			this.mlx = e.pageX;
			this.mly = e.pageY;
			this._handleMouseLeave(e);
		}
	}
	
	p._handleMouseLeave = function(e) {
		var evt = new MouseEvent("mouseleave", e.pageX, e.pageY, this, e);
		if (this.onMouseLeave) this.onMouseLeave(evt);
				
		//this.dispatchEvent(new createjs.MouseEvent("stagemouseout", false, false, e.pageX, e.pageY, e));
	}
		
	p.tick = function () {
        this.Stage_tick();
    }

	p.toString = function() {
		return "[StageX (name="+  this.name +")]";
	}

    window.StageX=StageX;
} (window));