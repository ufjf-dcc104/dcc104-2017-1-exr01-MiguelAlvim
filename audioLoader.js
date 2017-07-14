function AudioLoader(n){
	this.audios = {};
	this.channels = [];
	this.channelCount = n;

	for(var i=0;i<this.channelCount;i++){
		this.channels[i] = {
			audio: new Audio(),
			end: -1
		}
	};	
}

AudioLoader.prototype.load = function(key,url){
	this.audios[key] = new Audio();
	this.audios[key].src = url;
	this.audios[key].load();
}

AudioLoader.prototype.play = function(key,vol){
	var now = new Date();
	for(var i=0;i<this.channelCount;i++){
		var chan = this.channels[i];
		if(chan.end < now){
			chan.audio.src = this.audios[key].src;
			chan.end = now.getTime() + this.audios[key].duration*1000;
			chan.audio.volume = vol?vol:1;
			chan.audio.play();
			return chan.audio;
		}
	}	
	console.log("Unable to play sound \""+key+"\"\nAll "+this.channelCount+" channels ocupied" );
}