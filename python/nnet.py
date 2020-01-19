from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input,Dense,Dropout,Conv2D,BatchNormalization,Reshape,Activation,Add,GlobalAveragePooling2D
from tensorflow.keras.regularizers import l2
from tensorflow.keras.optimizers import Adam
from game import GAME_SIZE
from tensorflow.keras import backend as K
INPUT_SIZE=(GAME_SIZE,GAME_SIZE,2)
OUTPUT_SIZE=GAME_SIZE**2
def conv(filters):
	return Conv2D(filters,3,padding="same",use_bias=False,kernel_initializer="he_normal",kernel_regularizer=l2(0.0005))
def ResNet():
	def func(x):
		sc=x
		x=conv(128)(x)
		x=BatchNormalization()(x)
		x=Activation("relu")(x)
		x=conv(128)(x)
		x=BatchNormalization()(x)
		x=Add()([x,sc])
		x=Activation("relu")(x)
		return x
	return func

def NNet():
	input_layer=Input(shape=INPUT_SIZE)
	x=conv(128)(input_layer)
	x=BatchNormalization()(x)
	x=Activation("relu")(x)

	for _ in range(15):
		x=ResNet()(x)

	x=GlobalAveragePooling2D()(x)

	p=Dense(OUTPUT_SIZE,kernel_regularizer=l2(0.0005),activation="softmax",name="pi")(x)

	v=Dense(1,kernel_regularizer=l2(0.0005))(x)
	v=Activation("tanh",name="v")(v)
	return Model(inputs=input_layer,outputs=[p,v])

if __name__=="__main__":
	nnet=NNet()
	import os
	os.makedirs("./model/",exist_ok=True)
	nnet.save("./model/best.h5")
	K.clear_session()