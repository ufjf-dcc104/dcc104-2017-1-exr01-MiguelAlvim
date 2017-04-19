function Sprite(){
	//Bulding/Initial Variables
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
	this.angle = 0;//0 - 360
	this.color = "blue";
	
	//Movement Variables
	this.turnSpeed = 0;
	this.turnAcc = 0;
	this.velx = 0;	
	this.vely = 0;	
	this.accx = 0;
	this.accy = 0;
	this.accAng = 0;
	this.stopVelX = 5;
	this.stopVelY = 5;
	this.maxVel = 8;//Hard Coded maximum vel, Higher values will make collision detection imprecise. To fix, modify collision detection to also work with 2 time instances and verify if collision line was passed between them. I haven't done it as I didn't feel necessary
	this.accNaturalLimit = 2;//Maximum allowed acc from friction
	this.accCounterX=0;//Acceleration manipulated by the code only. It will stop the sprite naturally once standard acc reaches 0
	this.accCounterY=0;//Acceleration manipulated by the code only. It will stop the sprite naturally once standard acc reaches 0
	this.accGravityX =0;
	this.accGravityY =0;
	this.landingGearPos = new Array(2);
		this.landingGearPos[0] = new Array(4);
		this.landingGearPos[1] = new Array(4);
	this.updateLandingGearPos();
	
	//Control Variables
	this.rightMoveActivated=false;
	this.leftMoveActivated=false;
	this.upMoveActivated=false;
	this.downMoveActivated=false;
	this.collisionTolerance = 3;
}
//NOTES:
/*	The move function is called every frame. 
		Keydown is NOT called every frame. In 60FPS it were called from 16 to 20 times in the first seccond of pressing, with AVRG amount of 18 (in the majority of cases)
		After 1 seccong, the ratio is 1 call every 2 frames.
	The logic of friction is not a 1 - 1 scenario, as we have in avrg 3x more calls to desacelerate.
		So, if you want a 10 pixels/sec acceleration, you need to make the acelleration calls on the main program around 2x as big, so instead of 10 you call 30
	and expect a delay of 1 seccond for the expected results.
*/

Sprite.prototype.addACCX = function (val){//ADDS THE VALUE TO accx
	this.accx +=val;
}

Sprite.prototype.addACCY = function (val){//ADDS THE VALUE TO accy
	this.accy +=val;
}

Sprite.prototype.draw2 = function (ctx){//HAS TRANSLATE; WE CAN ROTATE AND STUFF
	ctx.save();
		ctx.translate(this.x,this.y);
		ctx.fillRect(-this.w/2,-this.h/2,this.h,this.w);//use the height and width to create, just like in OPENGL
		ctx.rotate(this.angle*Math.PI*2/180)//How to rotate, like in OPENGL
	ctx.restore()
};

Sprite.prototype.draw = function (ctx){//ALL THE DRAWING CALLS TO CREATE THE SHIP
	//CREATING THE PROPULSION EFFECTS - THEY COME FIRST SO THAT THE SHIP IS DRAWN ABOVE THEM
		//LATERAL THRUSTERS
	ctx.save();
		ctx.translate(this.x,this.y);
		ctx.rotate(this.angle*Math.PI*2/180);
		if(this.leftMoveActivated){
			//var grad = ctx.createLinearGradient(-this.w/2+20,-this.h/2+5,-this.w/2+100,-this.h/2+5);
			//var grad = ctx.createRadialGradient(-this.w/2+16,-this.h/2+5,1,-this.w/2+40,-this.h/2+50,6);
			var grad = ctx.createRadialGradient(-this.w/2-86,-this.h/2+10,1,-this.w/2+10,-this.h/2+30,100);
			grad.addColorStop(0,"black");
			grad.addColorStop(1,"white");
			ctx.fillStyle = grad;
			ctx.beginPath();
				ctx.arc(-this.w/2+15,-this.h/2+10,4,1.5*Math.PI,0.5*Math.PI);
			ctx.fill();
		}	
		if(this.rightMoveActivated){
			var grad = ctx.createRadialGradient(-this.w/2+86,-this.h/2+10,1,-this.w/2-10,-this.h/2+30,100);
			grad.addColorStop(0,"black");
			grad.addColorStop(1,"white");
			ctx.fillStyle = grad;
			ctx.beginPath();
				ctx.arc(-this.w/2,-this.h/2+10,4,0.5*Math.PI,1.5*Math.PI);
			ctx.fill();
		}	
			//MAIN VERTICAL THRUSTER
		if(this.upMoveActivated){
			var grad = ctx.createLinearGradient(-this.w/2+4,-this.h/2+30,-this.w/2+4,-this.h/2+41);
			//var grad = ctx.createRadialGradient(-this.w/2+7,-this.h/2+30,2,-this.w/2+12,-this.h/2+41,6);
			grad.addColorStop(0,"red");
			grad.addColorStop(0.5,"orange");
			grad.addColorStop(1,"white");
			ctx.fillStyle = grad;
			ctx.fillRect(-this.w/2+4,-this.h/2+30,7,8);
		}
		
		//CREATING THE MAIN SHAPE OF THE SHIP
			//Main body
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "black";
		ctx.fillRect(-this.w/2,-this.h/2,15,30);
		ctx.strokeRect(-this.w/2,-this.h/2,15,30);
		
			//Main thruster
		ctx.beginPath();
			ctx.moveTo(-this.w/2,-this.h/2+30);
			ctx.lineTo(-this.w/2+5,-this.h/2+30);
			ctx.lineTo(-this.w/2+5,-this.h/2+30+5);
			ctx.lineTo(-this.w/2,-this.h/2+30);
		ctx.fill();
		ctx.stroke(); 
		
		ctx.beginPath();
			ctx.moveTo(-this.w/2+15,-this.h/2+30);
			ctx.lineTo(-this.w/2+10,-this.h/2+35);
			ctx.lineTo(-this.w/2+10,-this.h/2+30);
			ctx.lineTo(-this.w/2+15,-this.h/2+30);
		ctx.fill();
		ctx.stroke(); 
		
			//Landing Gear
		ctx.lineWidth=1.5;
			ctx.beginPath();
				ctx.moveTo(-this.w/2,-this.h/2+20);
				ctx.lineTo(-this.w/2-5,-this.h/2+30);
				ctx.lineTo(-this.w/2-5,-this.h/2+36);
				ctx.lineTo(-this.w/2-7,-this.h/2+36);
				ctx.lineTo(-this.w/2-3,-this.h/2+36);
			ctx.stroke(); 
			
			ctx.beginPath();
				ctx.moveTo(-this.w/2+15,-this.h/2+20);
				ctx.lineTo(-this.w/2+20,-this.h/2+30);
				ctx.lineTo(-this.w/2+20,-this.h/2+36);
				ctx.lineTo(-this.w/2+22,-this.h/2+36);
				ctx.lineTo(-this.w/2+17,-this.h/2+36);
			ctx.stroke(); 
		ctx.lineWidth=1;
		
			//Control Module
		ctx.beginPath();
			ctx.moveTo(-this.w/2,-this.h/2);
			ctx.lineTo(-this.w/2+7.5,-this.h/2-8);
			ctx.lineTo(-this.w/2+15,-this.h/2);
			ctx.lineTo(-this.w/2,-this.h/2);
		ctx.fill();
		ctx.stroke(); 	
	ctx.restore()
};

Sprite.prototype.accLimiter = function (){//KEEPS THE ACCELERATION CREATED BY PLAYERS AND FRICTION IN THE LIMIT
	if (this.accx >0 && this.accx > this.accNaturalLimit){
		this.accx = this.accNaturalLimit;
	}else if (this.accx <0 && this.accx < -this.accNaturalLimit){
		this.accx = -this.accNaturalLimit;
	}
	
	if (this.accy >0 && this.accy > this.accNaturalLimit){
		this.accy = this.accNaturalLimit;
	}else if (this.accy <0 && this.accy < -this.accNaturalLimit){
		this.accy = -this.accNaturalLimit;
	}
}

// FrictionA functions operate by looking at the acceleration of the object, reducing it to 0, but do not create oposite acc towards movement
// FrictionB functions operate by looking at the velocity of the object, giving oposite acceleration towards its current movement direction.

Sprite.prototype.frictionXB = function (dt){
	if(Math.abs(this.accx == 0 && Math.abs(this.velx) != 0)){
		if(this.accGravityX ==0){
			this.accCounterX = -(this.velx*3);		
			if(Math.abs(this.accCounterX)<0.001){
				this.accCounterX =0;
				this.velx=0;
			}
		}
	}else{
		this.accCounterX = 0;
	}
}

Sprite.prototype.frictionYB = function (dt){
	if(Math.abs(this.accy == 0 && Math.abs(this.vely) != 0)){
		if(this.accGravityY ==0){
			this.accCounterY = -(this.vely)*3;		
			if(Math.abs(this.accCounterX)<0.001){
				this.accCounterY =0;
				this.vely=0;
			}
		}
	}else{
		this.accCounterY = 0;
	}
}

Sprite.prototype.frictionXA = function (dt){
	//if(this.accx !=0)
	//	console.log(this.accx);
	if(this.accx > 0){
		if(this.accx < this.stopVelX*dt){
			this.accx = 0;
		}else{
			this.accx -= this.stopVelX*dt;
		}
	}
	if(this.accx < 0){
		if(this.accx > -this.stopVelX*dt){
			this.accx = 0;
		}else{
			this.accx += this.stopVelX*dt;
		}
	}
}

Sprite.prototype.frictionYA= function (dt){
	if(this.accy > 0){
		if(this.accy < this.stopVelY*dt){
			this.accy = 0;
		}else{
			this.accy -= this.stopVelY*dt;
		}
	}
	if(this.accy < 0){
		if(this.accy > -this.stopVelY*dt){
			this.accy = 0;
		}else{
			this.accy += this.stopVelY*dt;
		}
	}
}

Sprite.prototype.updateLandingGearPos = function (){//UPDATES THE POSITIONS OF THE LANDING GEAR
	this.landingGearPos[0][0] = this.x-7;
	this.landingGearPos[0][1] = this.y+36;
	this.landingGearPos[0][2] = this.x-3;
	this.landingGearPos[0][3] = this.y+36;
	
	this.landingGearPos[1][0] = this.x+22;
	this.landingGearPos[1][1] = this.y+36;
	this.landingGearPos[1][2] = this.x+17;
	this.landingGearPos[1][3] = this.y+36;
}

Sprite.prototype.touchLandingGearPoint = function (xVal,yVal){//VERIFIES IF POINT IS TOUCHING THE LANDING GEAR
	var pos = this.landingGearPos;
	if( xVal-pos[0][0] >= 0 && xVal-pos[0][2] <= pos[0][0]-pos[0][2]){//Landing Gear 1
		if( (yVal-pos[0][1]).toFixed(0) >= 0 && (yVal-pos[0][3]).toFixed(2) <= 0)
		return true;
	}
	
	if( xVal-pos[1][0] >= 0 && xVal-pos[1][2] <= 0){//Landing Gear 2
		if( (yVal-pos[1][1]).toFixed(0) >= 0 && (yVal-pos[1][3]).toFixed(2) <= 0)
		return true;
	}	
	
	return false;
}

Sprite.prototype.touchLandingGearLine = function (xVal1,yVal1,xVal2,yVal2){//VERIFIES IF THE LANDING GEAR IS TOUCHING THE LINE
	var pos = this.landingGearPos;
	var vector = [xVal2-xVal1,yVal2-yVal1];//Direction vector of the line
	var midPoint =  [
					[pos[0][0]+(pos[0][2]-pos[0][0])/2,pos[0][1]+(pos[0][1]-pos[0][3])/2],
					[pos[1][0]+(pos[1][2]-pos[1][0])/2,pos[0][1]+(pos[1][1]-pos[1][3])/2]
					];//Middle point of each landing gear
	//	To rerify we just put each midPoint x in the formation function of the line ( vector*t + a point of the line, in this case, xVal1,yVal1)
	//and check to see if the Y is correct ( close enough, we accept +-1 point error margins)
	//Also, we check if the point is betwen the barrier of the line;	
	/*
	console.log("xt : "+(midPoint[0][0]-xVal1)/vector[0]);
	console.log("yt : "+(midPoint[0][1]-yVal1)/vector[1]);
	console.log("-------------------------------------------------");
	/**/
	if( (midPoint[0][0]>=xVal1 && midPoint[1][0]<=xVal2) /*&& (midPoint[0][1]>=yVal1 && midPoint[1][1]<=yVal2)*/ ){
		//Landing Gear 1
		var xT =0;
		var yT =0;
		if(vector[0]!=0)
		 xT = (midPoint[0][0]-xVal1)/vector[0];
	 
		if(vector[1]!=0)	 
		 yT = (midPoint[0][1]-yVal1)/vector[1];
	 
		if(vector[0]!=0 && vector[1]!=0){//Inclined Line
			//console.log("Inclined Line");
			if( Math.abs(xT-yT)<=0.01 )
				return true;		
		}else if(vector[0]!=0){//Horizontal Line
			//console.log("Horizontal Line");
			if(Math.abs(midPoint[0][1] - yVal1)<=this.collisionTolerance  )
				return true;
		}else if(vector[0]!=0){//Vertical Line... The game do not have vertical landing, ignore
		
		}else{//The SOB gave us a point, return false as a lesson
				return false;
		}
		
		
		//Landing Gear 2
		if(vector[0]!=0)
		 xT = (midPoint[1][0]-xVal1)/vector[0];
	 
		if(vector[1]!=0)	 
		 yT = (midPoint[1][1]-yVal1)/vector[1];
	 
		if(vector[0]!=0 && vector[1]!=0){//Inclined Line
			if( Math.abs(xT-yT)<=0.01 )
				return true;		
		}else if(vector[0]!=0){//Horizontal Line
			if(Math.abs(midPoint[1][1] - yVal1)<=this.collisionTolerance  )
				return true;
		}else if(vector[0]!=0){//Vertical Line... The game do not have vertical landing, ignore
		
		}else{//The SOB gave us a point, return false as a lesson
				return false;
		}
	}
	//console.log("-------------------------------------------------");
	return false;
}

Sprite.prototype.move = function (dt){//COMPUTES THE ACCELERATION AND MOVES THE SHIP
	this.accLimiter();
	
	//DEFAULT DIRECTION [0,1] - Original Angle of rotation is 0, but the ship is looking at 270º clockwise
	//this.accy += this.accAng*Math.sin(this.angle+1.5*Math.PI);
	//this.accx += this.accAng*Math.cos(this.angle+1.5*Math.PI);
	
	this.velx += this.accx*dt + this.accCounterX*dt + this.accGravityX*dt;
	this.vely += this.accy*dt + this.accCounterY*dt + this.accGravityY*dt;
	
	this.frictionXA(dt);
	this.frictionYA(dt);
	
	this.frictionXB(dt);
	this.frictionYB(dt);
	
	if(Math.abs(this.velx) > 0 && Math.abs(this.velx) > 0.001)
		this.x += this.velx;
	else
		this.velx =0;

	if(Math.abs(this.vely) > 0 && Math.abs(this.vely) > 0.001)	
		this.y += this.vely;	
	else
		this.vely =0;
	
	this.updateLandingGearPos();
};