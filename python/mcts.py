from game import Game
from math import sqrt
import numpy as np
from nnet import INPUT_SIZE
import os

def nodes_to_scores(nodes):
	scores = []
	for c in nodes:
		scores.append(c.n)
	return scores
class Node:
	def __init__(self,game,p):
		self.game=game
		self.p=p
		self.w=0
		self.n=0
		self.children=None
	def eval(self,model):
		if self.game.isDone():
			value=-1 if self.game.isLose() else 0
			self.w+=value
			self.n+=1
			return value
		if not self.children:
			a,b,c=INPUT_SIZE
			x=np.array([self.game.player1_board,self.game.player2_board])
			x=x.reshape(c,a,b).transpose(1,2,0).reshape(1,a,b,c)
			y=model.predict(x,batch_size=1)
			policies=y[0][0][list(self.game.getActions())]
			policies/=sum(policies) if sum(policies) else 1
			value=y[1][0][0]
			self.children=[]
			for act,policy in zip(self.game.getActions(),policies):
				self.children.append(Node(self.game.next(act),policy))
			self.n+=1
			self.w+=value
			return value
		value=-(self.select()).eval(model)
		self.w+=value
		self.n+=1
		return value
	def select(self):
		c_puct=1.0
		N=sum(nodes_to_scores(self.children))
		pucb=[]
		for child in self.children:
			pucb.append(-child.w/child.n if child.n else 0.0+c_puct*child.p* sqrt(N)/(1+child.n))
		return self.children[np.argmax(pucb)]
def mcts_score(model,game,t):
	root=Node(game,0)
	for _ in range(100):
		root.eval(model)
	scores=nodes_to_scores(root.children)
	if t==0:
		act=np.argmax(scores)
		scores=np.zeros(len(scores))
		scores[act]=1
	else:
		#boltzman
		scores=[x**(1/t)for x in scores]
		scores=[x/max(1,sum(scores))for x in scores]
	return scores

def mcts(model,game,t):
	def getAction(game):
		scores=mcts_score(model,game,t)
		return np.random.choice(game.getActions(),p=scores)
	return getAction
if __name__=="__main__":
	from keras.models import load_model
	model=load_model("./model/best.h5")
	mcts_score(model,Game(),0.0)