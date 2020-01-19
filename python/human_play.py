from game import Game	
from mcts import mcts
from nnet import NNet

model=NNet()
model.load_weights("./model/best.h5")
class UI:
	def __init__(self):
		self.game=Game()
		self.next_act=mcts(model,self.game,0.0)
	def compute(self):
		if self.game.isDone():
			return
		act=self.next_act(self.game)
		self.game=self.game.next(act)
	def draw(self):
		print(self.game)
	def getInput(self):
		try:
			location=input("Your move: ")
			location=[int(n,10)for n in location.split(",")]
			act=location[0]*self.game.n+location[1]
		except KeyboardInterrupt:
			exit(0)
		except:
			act=-1
			print("Usage: x,y")
		if not (act in self.game.getActions()):
			print("Invalid move")
			return False
		self.game=self.game.next(act)
		return True
	def run(self):
		canGet=True
		while not self.game.isDone():
			self.draw()
			canGet=self.getInput()
			if self.game.isDone():
				if self.game.isLose():
					print("Human wins.")
				else:
					print("Draw")
				return
			if canGet:
				self.draw()
				self.compute()
		if self.game.isLose():
			print("Computer wins.")
		else:
			print("Draw.")

if __name__=="__main__":
	ui=UI()
	ui.run()