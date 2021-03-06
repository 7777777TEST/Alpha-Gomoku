var App=App||{}
App.Point=function(x=0,y=0){
	this.x=x;
	this.y=y;
}
App.Point.prototype.equal=function(p=new App.Point(0,0)){
	return this.x==p.x&&this.y==p.y;
}
App.Gomoku=function(size=8){
	this.map=[[0]];
	for(var x=0;x<size;x++){
		this.map[x]=[];
		for(var y=0;y<size;y++){
			this.map[x][y]=0;
		}
	}
	this.size=size;
	this.id=1;
	this.win=0;
	this.points=[];
}
App.Gomoku.prototype.reset=function(size=0){
	if(size!=0){
		this.size=size;
		for(var x=0;x<size;x++){
			this.map[x]=[];
			for(var y=0;y<size;y++){
				this.map[x][y]=0;
			}
		}
	}else{
		for(var x=0;x<this.size;x++){
			this.map[x]=[];
			for(var y=0;y<this.size;y++){
				this.map[x][y]=0;
			}
		}
	}
	this.id=1;
	this.win=0;
	this.points=[];
}
App.Gomoku.prototype.put=function(x=0,y=0){
	if(this.map[x][y]!=0){
		return 0;
	}
	this.map[x][y]=this.id;
	this.points.push({x:x,y:y});
	this.id=this.next(this.id);
	return this.id;
}
App.Gomoku.prototype.undo=function(){
	if(this.points.length==0){
		return;
	}
	var x=this.points[this.points.length-1].x;
	var y=this.points[this.points.length-1].y;
	this.map[x][y]=0;
	this.id=this.next(this.id);
	this.points.pop();
}
App.Gomoku.prototype.next=function(id=1){
	if(id==1){
		return 2;
	}else{
		return 1;
	}
}
App.Gomoku.prototype.evaluate=function(id=0){
	var lines=[];
	for(var x=0;x<this.size;x++){
		for(var y=0;y<this.size;y++){
			if(this.map[x][y]==id){
				var block=0,piece=1;
				if(y==0){
					block++;
				}else if(y>0){
					if(this.map[x][y-1]!=0){
						block++;
					}
				}
				for(y++;y<this.size&&this.map[x][y]==id;y++){
					piece++;
				}
				if(y==this.size){
					block++;
				}else if(y<this.size-1){
					if(this.map[x][y+1]!=0){
						block++;
					}
				}
				lines.push({block:block,piece:piece});
			}
		}
	}
	for(var y=0;y<this.size;y++){
		for(var x=0;x<this.size;x++){
			if(this.map[x][y]==id){
				var block=0,piece=1;
				if(y==0){
					block++;
				}else if(x>0){
					if(this.map[x-1][y]!=0){
						block++;
					}
				}
				for(x++;x<this.size&&this.map[x][y]==id;x++){
					piece++;
				}
				if(x==this.size){
					block++;
				}else if(x<this.size-1){
					if(this.map[x+1][y]!=0){
						block++;
					}
				}
				lines.push({block:block,piece:piece});
			}
		}
	}
	for (var i = 0; i < this.size*2-1; i ++) {
		var x = i;
		var y = 0;
		while (x >= 0 && y < this.size) {
			if (x < this.size) {
				if (this.map[x][y] === id) {
					var block = 0;
					var piece = 1;
					if (y === 0 || x === this.size - 1) {
						block++;
					}else if(this.map[x + 1][y - 1] !== 0){
						block++;
					}
					x--; y++;
					for (; x >= 0 && this.map[x][y] === id; x--) {
						piece++;
						y++
					}
					if (x < 0 || y >= this.size) {
						block++;
					}else if(this.map[x][y]!=0){
						block++;
					}
					lines.push({block:block,piece:piece});
				}
			}
			x --;
			y ++;
		}
	}
	for (var i = -this.size; i < this.size; i ++) {
		var x = i;
		var y = 0;
		while (x < this.size && y < this.size) {
			if (x < this.size&&x>=0) {
				if (this.map[x][y] === id) {
					var block = 0;
					var piece = 1;
					if (y === 0 || x === 0) {
						block++;
					}else if(this.map[x - 1][y - 1] !== 0){
						block++;
					}
					x++; y++;
					for (; x <this.size && this.map[x][y] === id; x++) {
						piece++;
						y++
					}
					if (x ===this.size || y === this.size) {
						block++;
					}else if(this.map[x][y] !== 0){
						block++;
					}
					lines.push({block:block,piece:piece});
				}
			}
			x ++;
			y ++;
		}
	}
	return lines;
}
App.Gomoku.prototype.check=function(){
	for(var x=0;x<this.size;x++){
		var id=0,count=0;
		for(var y=0;y<this.size;y++){
			if(id==this.map[x][y]){
				count++;
				if(count==5&&id!=0){
					return id;
				}
			}else{
				id=this.map[x][y];
				count=1;
			}
		}
	}
	for(var y=0;y<this.size;y++){
		var id=0,count=0;
		for(var x=0;x<this.size;x++){
			if(id==this.map[x][y]){
				count++;
				if(count==5&&id!=0){
					return id;
				}
			}else{
				id=this.map[x][y];
				count=1;
			}
		}
	}
	for (var i = -this.size; i < this.size; i ++) {
		var x = i;
		var y = 0;
		var id=0,count=0;
		while (x < this.size && y < this.size) {
			if (x < this.size&&x>=0) {
				if(id==this.map[x][y]){
					count++;
					if(count==5&&id!=0){
						return id;
					}
				}else{
					id=this.map[x][y];
					count=1;
				}
			}
			x ++;
			y ++;
		}
	}
	for (var i = 0; i < this.size*2-1; i ++) {
		var x = i;
		var y = 0;
		var id=0,count=0;
		while (x >= 0 && y < this.size) {
			if (x < this.size) {
				if(id==this.map[x][y]){
					count++;
					if(count==5&&id!=0){
						return id;
					}
				}else{
					id=this.map[x][y];
					count=1;
				}
			}
			x --;
			y ++;
		}
	}
	for(var x=0;x<this.size;x++){
		for(var y=0;y<this.size;y++){
			if(this.map[x][y]==0){
				return 0;
			}
		}
	}
	return -1;
}
App.Gomoku.prototype.copy=function() {
	var ret=new App.Gomoku(this.size);
	ret.map=JSON.parse(JSON.stringify(this.map));
	ret.points=JSON.parse(JSON.stringify(this.points));
	ret.id=this.id;
	ret.win=this.win;
	return ret;
}
App.Gomoku.prototype.getActions=function(){
	var ret=[];
	var isOk=function (x = 0, y = 0, board=App.Gomoku()) {
		var size=board.size;
		if (board.map[x][y] != 0) return false;
		const range=1;
		for (var dx = -range; dx <= range; dx++)
			for (var dy = -range; dy <= range; dy++)
				if (x + dx >= 0 && x + dx < size && y + dy >= 0 && y + dy < size)
					if (board.map[x + dx][y + dy] != 0 ) return true;
		return false;
	}
	for(var x=0;x<this.size;x++){
		for(var y=0;y<this.size;y++){
			if(!this.map[x][y]){
				ret.push({x:x,y:y});
			}
		}
	}
	if(ret.length==0){
		ret.push({x:7,y:7});
	}
	return ret;
}
App.Gomoku.prototype.toString=function(){
	return JSON.stringify(this.map);
}