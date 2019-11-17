var App=App||{};
App.AI=App.AI||{};
App.AI.AI=function(game=new App.Gomoku()){
	this.game=game;
	this.id=0;
}
App.AI.AI.prototype.isOk=function (x = 0, y = 0) {
	var size=this.game.size;
	if (this.game.map[x][y] != 0) return false;
	for (var dx = -1; dx < 3; dx++)
		for (var dy = -1; dy < 3; dy++)
			if (x + dx >= 0 && x + dx < size && y + dy >= 0 && y + dy < size)
				if (this.game.map[x + dx][y + dy] != 0 ) return true;
	return false;
};
App.AI.AI.prototype.getActions=function(){
	var ret=[];
	for(var x=0;x<this.game.map.length;x++){
		for(var y=0;y<this.game.map.length;y++){
			if(this.isOk(x,y)){
				ret.push({x:x,y:y});
			}
		}
	}
	return ret;
}
App.AI.AI.prototype.policy=function(turn=0){
	var act=this.getActions();
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
	var act=this.getActions();
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