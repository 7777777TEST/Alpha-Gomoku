var App=App||{};
App.AI=App.AI||{};
App.AI.AI=function(game=new App.Gomoku()){
	this.game=game;
	this.id=0;
}
App.AI.AI.prototype.policy=function(turn=0){
	var act=this.game.getActions();
	for(var i=0,id=0;i<act.length;i++){
		this.game.put(act[i].x,act[i].y);
		id=this.game.check();
		this.game.undo();
		if(id==turn){
			return act[i];
		}
	}
	return act[Math.floor(Math.random()*act.length)];
}
App.AI.AI.prototype.trial=function(){
	var ret=0;
	var i=0;
	for(i=0;i<this.game.size**2;i++){
		var winner=this.game.check();
		if(winner==this.id){
			ret=0.9**i;
			break;
		}else if(winner==this.game.next(this.id)){
			ret=-(0.9**i);
			break;
		}else if(winner==-1){
			break;
		}
		var select=this.policy(this.game.id);
		this.game.put(select.x,select.y);
	}
	for(var j=0;j<i;j++){
		this.game.undo();
	}
	return ret;
}
App.AI.AI.prototype.compute=function(){
	var act=this.game.getActions();
	var score=[1];
	var epoch=250;
	var best=Math.min(0,act.length-1);
	for(var i=0;i<act.length;i++){
		this.game.put(act[i].x,act[i].y);
		score[i]=0;
		for(var j=0;j<epoch;j++){
			score[i]+=this.trial()/epoch;
		}
		if(score[best]<score[i]){
			best=i;
		}
		this.game.undo();
	}
	this.game.put(act[best].x,act[best].y);
	return 0;
}