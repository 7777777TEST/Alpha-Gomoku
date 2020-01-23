var App=App||{};
App.canvas=document.getElementById("canvas");
App.ctx=App.canvas.getContext("2d");
App.status=document.getElementById("status");
App.gomoku=new App.Gomoku(9);
App.tilesize=40;
App.canvas.width=App.tilesize*(App.gomoku.size+1);
App.canvas.height=App.tilesize*(App.gomoku.size+1);
App.ctx.lineWidth=1.0;
App.ai=new App.AI.AI(App.gomoku);
App.draw=function(){
	App.ctx.clearRect(0,0,(App.gomoku.size+1)*App.tilesize,(App.gomoku.size+1)*App.tilesize);
	App.ctx.beginPath();
	App.ctx.strokeStyle="#000";
	for(var x=0;x<App.gomoku.size;x++){
		App.ctx.moveTo((x+1)*App.tilesize,0);
		App.ctx.lineTo((x+1)*App.tilesize,(App.gomoku.size+1)*App.tilesize);
	}
	for(var y=0;y<App.gomoku.size;y++){
		App.ctx.moveTo(0,(y+1)*App.tilesize);
		App.ctx.lineTo((App.gomoku.size+1)*App.tilesize,(y+1)*App.tilesize);
	}
	App.ctx.stroke();
	for(var x=0;x<App.gomoku.size;x++){
		for(var y=0;y<App.gomoku.size;y++){
			if(App.gomoku.map[x][y]==1){
				App.ctx.strokeStyle="#09D";
			}else if(App.gomoku.map[x][y]==2){
				App.ctx.strokeStyle="#D08";
			}else{
				continue;
			}
			App.ctx.beginPath();
			App.ctx.arc((x+1)*App.tilesize,(y+1)*App.tilesize,App.tilesize/2-2,0,6.3);
			App.ctx.stroke();
		}
	}
}
App.draw();
App.locked=true;
App.compute=function(){
	var start=Date.now();
	App.ai.id=App.gomoku.id;
	App.ai.compute(5);
	console.log(Date.now()-start);
	App.status.textContent="";
	var id=App.gomoku.check();
	App.draw();
	App.locked=false;
	if(id>0){
		alert("player "+id+" win");
		App.gomoku.win=id;
	}else if(id==-1){
		alert("DRAW");
		App.gomoku.win=-1;
	}
}
App.canvas.addEventListener("click",function(ev){
	if(App.locked)return;
	if(App.gomoku.win!=0){
		App.gomoku.reset();
		alert("RESTART");
		App.draw();
		return;
	}
	var mx=ev.clientX-ev.target.getBoundingClientRect().left-App.tilesize/2;
	var my=ev.clientY-ev.target.getBoundingClientRect().top-App.tilesize/2;
	var x=Math.floor(mx/App.tilesize),y=Math.floor(my/App.tilesize);
	if(x<0||x>=App.gomoku.size||y<0||y>=App.gomoku.size)return;
	App.gomoku.put(x,y);
	var id=App.gomoku.check();
	App.draw();
	if(id>0){
		alert("player "+id+" win");
		App.gomoku.win=id;
		return;
	}else if(id==-1){
		alert("DRAW");
		App.gomoku.win=-1;
		return;
	}
	App.status.textContent="Thinking..";
	App.locked=true;
	setTimeout(App.compute,100);
});
App.status.textContent="Thinking..";
setTimeout(App.compute,100)