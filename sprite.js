function Sprite(){
	this.x = 40;
	this.y = 40;
	this.velx = 0;	
	this.vely = 0;	
	this.accx = 0;
	this.accy = 0;
	this.stopVel = 100;
	this.accLimit = 50;
	this.color = "blue";
	this.gravity =0;
}

Sprite.prototype.addXAcc = function (val){
	if(val > this.accLimit){
		val = this.accLimit;
	}
	if(val < -this.accLimit && val <0){
		val = -this.accLimit;
	}
	if(val<0){
		if(this.accx <=0 && this.accx >-this.accLimit){
			this.accx+=val;
		}
	}
	if(val>0){
		if(this.accx <=0 && this.accx >-this.accLimit){
			this.accx+=val;
		}
	}
	if(this.accx >=0 && this.accx <this.accLimit){
		this.accx+=val;
	}
};

Sprite.prototype.addYAcc = function (val){
	if(val > this.accLimit){
		val = this.accLimit;
	}
	if(val < -this.accLimit && val <0){
		val = -this.accLimit;
	}
	if(val<0){
		if(this.accy <=0 && this.accy >-this.accLimit){
			this.accy+=val;
		}
	}
	if(val>0){
		if(this.accy <=0 && this.accy >-this.accLimit){
			this.accy+=val;
		}
	}
	if(this.accy >=0 && this.accy <this.accLimit){
		this.accy+=val;
	}
};
Sprite.prototype.draw = function (ctx){
	ctx.fillColor = this.color;
	ctx.fillRect(this.x,this.y,30,30);
	ctx.strokeStyle = "black";
	ctx.strokeRect(this.x,this.y,30,30);
};

Sprite.prototype.friction = function (dt){
	
}

Sprite.prototype.move = function (dt){
	if(this.accx >0){
		this.accx -= this.stopVel;
	}else if(this.accx < 0){
		this.accx += this.stopVel;
	}
	if(this.accx >0 && this.accx < this.stopVel)
		this.accx =0;
	
	if(this.accy >0 && this.accy < this.stopVel)
		this.accy =0;
	
	if(this.accx <0 && this.accx > this.stopVel)
		this.accx =0;
	
	if(this.accy <0 && this.accy > this.stopVel)
		this.accy =0;
	
	if(this.accy >0){
		this.accy -= this.stopVel*dt;
	}else if(this.accy < 0){
		this.accy += this.stopVel*dt;
	}
	
	
	this.velx = this.accx;
	this.vely = this.accy;
	this.x += this.velx*dt;
	this.y += this.vely*dt;	
};