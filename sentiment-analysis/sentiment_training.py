import pandas as pd
import tensorflow as tf
import numpy as np
import re
from keras.datasets import imdb
from keras.preprocessing import sequence
import sys
import json
import string

sys.stdout.reconfigure(encoding='utf-8')

VOCAB_SIZE = 88584
MAXLEN = 250
BATCH_SIZE = 64

(train_data, train_labels), (test_data, test_labels) = imdb.load_data(num_words = VOCAB_SIZE)

train_data = sequence.pad_sequences(train_data, MAXLEN)
test_data = sequence.pad_sequences(test_data, MAXLEN)

model = tf.keras.Sequential([ 
    tf.keras.layers.Embedding(VOCAB_SIZE, 64), 
    tf.keras.layers.LSTM(64), 
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dropout(0.5), 
    tf.keras.layers.Dense(1, activation="sigmoid")
])

model.compile(loss="binary_crossentropy", optimizer="adam", metrics=['acc'])

history = model.fit(train_data, train_labels, epochs=10, validation_split=0.2)

results = model.evaluate(test_data, test_labels)
print(results)

word_index = imdb.get_word_index()

with open('vocabulary.json', 'w') as f:
    json.dump(word_index, f)

def encode_text(text):
  tokens = tf.strings.split(text)
  tokens = [word.decode('utf-8') for word in tokens.numpy()]  
  for word in tokens:
      if word in word_index:
          tokens.append(word)
      else:
          tokens.append(0)
  return sequence.pad_sequences([tokens], MAXLEN)[0]

def predict(text):
    encoded_text = encode_text(text)
    pred = np.zeros((1, MAXLEN))
    pred[0] = encoded_text
    result = model.predict(pred)

positive_review = "That movie was so awesome! I really loved it and would great watch it again because it was amazingly great"
predict(positive_review)

model.save('my_model.keras')