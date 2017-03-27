function Bar(){//Used to show values as bars. Also store them using the variable actualValue
	//Bulding/Initial Variables
	this.x = 0;
	this.y = 0;
	this.color = "red";
	this.height = 0;
	this.width = 0;
	this.orientation =0;//0 = Horizontal, else = Vertical; used to know the direction to deplete the bar
	this.maxValue=100;
	this.actualValue=100;
	this.writeTotal=true;
	//this.direction =0;//0 = right to left or down to up; 1 = the opposite
}

Bar.prototype.draw = function (ctx){	
	ctx.fillStyle = this.color;
	ctx.strokeStyle = "black";
	if(this.orientation==0){
		ctx.fillRect(this.x,this.y,this.width*(this.actualValue/this.maxValue),this.height);
	}else{
		ctx.fillRect(this.x,this.y,this.width,this.height*(this.actualValue/this.maxValue));
	}
	ctx.strokeRect(this.x,this.y,this.width,this.height);
	
	if(this.writeTotal){	
		ctx.fillStyle = "black";
		ctx.fillText((this.maxValue).toFixed(2)+" / "+(this.actualValue).toFixed(2),(this.x+(this.width)/6),this.y+(this.height/1));
	}
}