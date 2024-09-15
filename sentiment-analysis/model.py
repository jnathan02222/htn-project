import tensorflow as tf
import numpy as np
from keras.preprocessing import sequence
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('vocabulary.json', 'r') as f:
    word_index = json.load(f)

MAXLEN = 20

model = tf.keras.models.load_model('my_model.keras')

def encode_text(text):
    tokens = tf.strings.split(text)
    tokens = [word.decode('utf-8') for word in tokens.numpy()]
    int_tokens = []
    for word in tokens:
        if word in word_index:
            int_tokens.append(word_index.index(word))
        else:
            int_tokens.append(0)
    return sequence.pad_sequences([np.array(int_tokens)], maxlen=MAXLEN)[0]

def predict(text):
    encoded_text = encode_text(text)
    pred = np.zeros((1, MAXLEN))
    pred[0] = encoded_text
    result = model.predict(pred)
    print(result[0])
    
input = "happy mother`s day to all moms out there..."    
predict(input)

    
