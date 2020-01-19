from nnet import INPUT_SIZE
from tensorflow.keras import backend as K
import numpy as np
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.callbacks import LearningRateScheduler, LambdaCallback
from pathlib import Path

EPOCHS=100

def load():
	history_path=sorted(Path("./data").glob("*.history"))[-1]
	with history_path.open(mode="rb") as f:
		return pickle.load(f)

def train_net():
	history=load()
	xs,pi,v=zip(*history)
	a,b,c=INPUT_SIZE
	xs=np.array(xs)
	xs=xs.reshape(len(xs),c,a,b).transpose(0,2,3,1)
	pi=np.array(pi)
	v=np.array(v)
	model=load_model("./model/best.h5")
	model.compile(loss=['categorical_crossentropy', 'mse'], optimizer='adam')
	def step(epoch):
		x=0.001
		if epoch>=50:x=0.0005
		if epoch>=100:x=0.00025
		return x
	lr=LearningRateScheduler(step)
	print_callback=LambdaCallback(on_epoch_begin=lambda epoch,logs: print("\rTrain {}/{}".format(epoch+1,EPOCHS),end=""))
	model.fit(xs,[pi,v], batch_size=128, epochs=EPOCHS,verbose=0,callbacks=[lr,print_callback])
	print("")
	model.save("./model/best.h5")
	K.clear_session()
	del model
if __name__=="__main__":
	train_net()