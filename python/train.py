import os
from nnet import NNet
from self_play import self_play
from train_net import train_net
from nnet import INPUT_SIZE

TRAIN_COUNT=100
nnet=NNet()
os.makedirs("./model/",exist_ok=True)
if not os.path.isfile("./model/best.h5"):
	nnet.save("./model/best.h5")
	print("created model")
else:
	nnet.load_weights("./model/best.h5")
	print("loaded model")

for i in range(TRAIN_COUNT):
	print("Train ------- {}/{} -------".format(i+1,TRAIN_COUNT))
	self_play()
	train_net()