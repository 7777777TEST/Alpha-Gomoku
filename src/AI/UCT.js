var App=App||{};
App.AI=App.AI||{};
App.AI.Node=function(game=new App.Gomoku(),parentNode,act={x:0,y:0}){
	this.unchecked=game.getActions();
	this.parent=parentNode;
	this.children=[];
	this.win=0;
	this.visit=0;
	this.turn=game.id;
	this.act=act;
}
App.AI.Node.prototype.add=function(game=new App.Gomoku(),index=0){
	var node=new App.AI.Node(game,this,this.unchecked[index]);
	this.unchecked.splice(index,1);
	this.children[this.children.length]=node;
	return node;
}
App.AI.Node.prototype.select=function(){
	var selected=null;
	var best=Number.MIN_SAFE_INTEGER;
	for(var i=0;i<this.children.length;i++){
		var child=this.children[i];
		var value=child.win/child.visit+Math.sqrt(2*Math.log(this.visit)/child.visit);
		if(value>best){
			selected=child;
			best=value
		}
	}
	return selected;
}
App.AI.Node.prototype.update=function(result=0){
	this.visit++;
	this.win+=result;
}
App.AI.Node.prototype.mostVisited=function(){
	var selected=this.children[0];
	for(var i=0;i<this.children.length;i++){
		if(selected.visit<this.children[i].visit){
			selected=this.children[i];
		}
	}
	return selected;
}
App.AI.AI=function(game=new App.Gomoku()){
	this.game=game;
	this.id=0;
	this.maxTime=20000;
	this.maxIter=5000000;
}
App.AI.AI.prototype.compute=function(){
	var start=Date.now();
	var limit=start+this.maxTime;
	var visit=0;
	var root=new App.AI.Node(this.game,null,null);
	while(Date.now()<limit&&visit<this.maxIter){
		var node=root;
		var board=this.game.copy();
		while(node.unchecked.length==0&&node.children.length>0){
			node=node.select();
			board.put(node.act.x,node.act.y);
		}
		if(node.unchecked.length>0){
			var j=Math.floor(Math.random()*node.unchecked.length);
			board.put(node.unchecked[j].x,node.unchecked[j].y);
			node=node.add(board,j);
		}
		var act=board.getActions();
		while(act.length>0&&board.check()==0){
			var select=act[Math.floor(Math.random()*act.length)];
			board.put(select.x,select.y);
			act=board.getActions();
			visit++;
		}
		var win=board.check();
		var result=win==this.id?1:(win==this.game.next(this.id)?-1:0);
		while(node){
			node.update(result);
			result*=0.9;
			node=node.parent;
		}
		if(root.mostVisited().visit>50000){
			break;
		}
	}
	console.log(Math.floor(visit*1000/(Date.now()-start))+"/sec");
	var best=root.mostVisited().act;
	this.game.put(best.x,best.y);
	return;
}