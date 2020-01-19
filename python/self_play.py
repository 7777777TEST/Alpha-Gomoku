from game import Game
from mcts import mcts_score
from nnet import OUTPUT_SIZE
from tensorflow.keras.models import load_model
from tensorflow.keras import backend as K
from pathlib import Path
import pickle
import numpy as np
import os
from datetime import datetime

GAME_COUNT=100
TEMPERATURE=1.0

def firstPlayerValue(game):
	if game.isLose():
		return -1 if game.isFirstPlayer() else 1
	return 0

def play(model):
	history=[]
	game=Game()
	while True:
		if game.isDone():
			break
		scores=mcts_score(model,game,TEMPERATURE)
		policies=[0]*OUTPUT_SIZE
		for act,policy in zip(game.getActions(),scores):
			policies[act]=policy
		history.append([[game.player1_board,game.player2_board],policies,0])
		act=np.random.choice(game.getActions(),p=scores)
		game=game.next(act)
	value=firstPlayerValue(game)
	for i in range(len(history)):
		history[i][2]=value
		value=-value
	return history

def self_play():
	history=[]
	model=load_model("./model/best.h5")
	for i in range(GAME_COUNT):
		print("\rSelfPlay {}/{}".format(i+1,GAME_COUNT),end="")
		h=play(model)
		history.extend(h)
	print("")
	now=datetime.now()
	os.makedirs("./data/",exist_ok=True)
	path="./data/{:02}-{:02} {:02}:{:02}:{:02}.history".format(now.month,now.day,now.hour,now.minute,now.second)
	with open(path,mode="wb") as f:
		pickle.dump(history,f)
	K.clear_session()
if __name__=="__main__":
	self_play()