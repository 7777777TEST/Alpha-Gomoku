GAME_SIZE=9
class Game:
	def __init__(self,player1_board=None,player2_board=None,n=GAME_SIZE):
		self.player1_board=player1_board if player1_board != None else [0]*(n**2)
		self.player2_board=player2_board if player2_board != None else [0]*(n**2)
		self.n=n
		self.depth=0
	def isLose(self):
		for x in range(self.n):
			count=0
			for y in range(self.n):
				if self.player2_board[x*self.n+y]==1:
					count+=1
					if count==5:
						return True
				else:
					count=0
		for y in range(self.n):
			count=0
			for x in range(self.n):
				if self.player2_board[x*self.n+y]==1:
					count+=1
					if count==5:
						return True
				else:
					count=0
		for i in range(self.n*2-1):
			x,y=i,0
			count=0
			while y<self.n & x>=0:
				if x<self.n:
					if self.player2_board[x*self.n+y]==1:
						count+=1
						if count==5:
							return True
					else:
						count=0
				x-=1
				y+=1
		for i in range(-self.n,self.n):
			x,y=i,0
			count=0
			while y<self.n & x<self.n:
				if x<self.n:
					if self.player2_board[x*self.n+y]==1:
						count+=1
						if count==5:
							return True
					else:
						count=0
				x+=1
				y+=1
		return False
	def isDraw(self):
		return len(self.getActions())==0
	def isDone(self):
		return self.isLose() | self.isDraw()
	def getActions(self):
		ret=[]
		for i in range(self.n**2):
			if self.player1_board[i]+self.player2_board[i]==0:
				ret.append(i)
		return ret
	def isFirstPlayer(self):
		return self.depth%2==0
	def next(self,action):
		game=Game(self.player2_board.copy(),self.player1_board.copy(),self.n)
		game.player2_board[action]=1
		game.depth=self.depth+1
		return game
	def __str__(self):
		ox=("o","x")if self.isFirstPlayer() else ("x","o")
		ret=""
		for i in range(self.n**2):
			if self.player1_board[i]==1:
				ret+=ox[0]
			elif self.player2_board[i]==1:
				ret+=ox[1]
			else:
				ret+="-"
			if i%self.n==self.n-1:
				ret+="\n"
		return ret

if __name__=="__main__":
	import numpy as np
	import os
	game=Game()
	while True:
		os.system("cls")
		print(str(game))
		if game.isDone():
			break
		game=game.next(np.random.choice(game.getActions()))