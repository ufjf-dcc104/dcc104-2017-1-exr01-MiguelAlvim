function ImgLoader(){
	this.images = {};
}

ImgLoader.prototype.addImg = function (imgURL,key){
	var img = new Image();
	img.src = imgURL;
	this.images[key] = img;
	
}

ImgLoader.prototype.drawImg = function (ctx,key,sx,sy,sw,sh,dx,dy,dw,dh){
	ctx.drawImage(this.images[key],sx,sy,sw,sh,dx,dy,dw,dh);
}