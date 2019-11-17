App.AI=App.AI||{};
App.AI.AI=function(game=new App.Gomoku()){
	this.game=game;
	this.id=0;
}
App.AI.AI.prototype={
	isOk:function (x = 0, y = 0) {
		var size=this.game.size;
		if (this.game.map[x][y] != 0) return false;
		for (var dx = -1; dx < 2; dx++)
			for (var dy = -1; dy < 2; dy++)
				if (x + dx >= 0 && x + dx < size && y + dy >= 0 && y + dy < size)
					if (this.game.map[x + dx][y + dy] != 0 ) return true;
		return false;
	},
	getActions:function(){
		var ret=[];
		for(var x=0;x<this.game.map.length;x++){
			for(var y=0;y<this.game.map.length;y++){
				if(this.isOk(x,y)){
					ret.push({x:x,y:y});
				}
			}
		}
		if(ret.length==0){
			ret.push({x:7,y:7});
		}
		return ret;
	},
	evaluate:function(id=0,param=[Number.MAX_SAFE_INTEGER-100,Number.MAX_SAFE_INTEGER/2,Number.MAX_SAFE_INTEGER/2,20,30,10,1,1]){
		var list=this.game.evaluate(id);
		var score=0;
		for(var i=0;i<list.length;i++){
			if(list[i].block==2&&list[i].piece<5){
				continue;
			}
			switch(list[i].piece){
				case 4:{
					if(list[i].block==0)
						score+= param[0];
					score+= param[1];
				}
				case 3:{
					if(list[i].block==0)
					score+= param[2];
					else
					score+= param[3];
				}
				case 2:{
					if(list[i].block==0)
					score+= param[4];
					else
					score+= param[5];
				}
				case 1:{
					if(list[i].block==0)
					score+= param[6];
					else
					score+= param[7];
				}
				default:{
					if(list[i].piece>=5)
						return Infinity;
				}
			}
		}
		return score;
	},
	minimax:function(depth=0,flag=false,alpha=-Infinity,beta=Infinity){
		if(this.game.check()==this.game.next(this.id))return -Infinity;
		if(depth==0||this.game.check()!=0){
			return this.evaluate(this.id)-this.evaluate(this.game.next(this.id));
		}
		var best=-Infinity;
		if(!flag){
			best=Infinity;
		}
		var actions=this.getActions();
		for(var i=0;i<actions.length;i++){
			var x=actions[i].x,y=actions[i].y;
			this.game.put(x,y);
			if(flag){
				best=Math.max(best,this.minimax(depth-1,false,alpha,beta));
				alpha=Math.max(best,alpha);
			}else{
				best=Math.min(best,this.minimax(depth-1,true,alpha,beta));
				beta=Math.min(beta,best);
			}
			this.game.undo();
			if(alpha>=beta)
				break;
		}
		return best;
	},
	compute:function(depth=3){
		var best=-Infinity;
		var actions=this.getActions();
		var ret={x:0,y:0};
		var alpha=-Infinity;
		var beta=Infinity;
		for(var i=0;i<actions.length;i++){
			var x=actions[i].x,y=actions[i].y;
			this.game.put(x,y);
			var score=this.minimax(depth-1,false,alpha,beta);
			if(score>=best){
				ret={x:x,y:y};
				best=score;
			}
			alpha=Math.max(best,alpha);
			this.game.undo();
			if(alpha>=beta)
				break;
		}
		if(best==-Infinity){
			ret=actions[Math.floor(Math.random()*actions.length)];
		}
		this.game.put(ret.x,ret.y);
		return 0;
	}
}