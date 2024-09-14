from keras.preprocessing import sequence
import keras
import tensorflow as tf
import os
import numpy as np
import pandas as pd
import re

VOCAB_SIZE = 25000
MAXLEN = 20
BATCH_SIZE = 64
SPLIT = 0.8

encoding = {
    'negative': [1,0,0],
    'neutral': [0,1,0], 
    'positive': [0,0,1]
}

def clean_text(text):
    text = re.sub(r'[^A-Za-z0-9 ]+', '', text)
    return text

def label_encoding(labels):
    encoded_labels = [encoding[label] for label in labels]
    return np.array(encoded_labels, dtype=np.float32)
        
traindf = pd.read_csv("/Users/isaac/Documents/Coding Projects/htn-project/sentiment-analysis/train.csv", encoding='ISO-8859-1')
testdf = pd.read_csv("/Users/isaac/Documents/Coding Projects/htn-project/sentiment-analysis/test.csv", encoding='ISO-8859-1')

traindf = traindf.dropna(subset=['text'])
testdf = testdf.dropna(subset=['text'])

traindf['text'] = traindf['text'].apply(clean_text)
testdf['text'] = testdf['text'].apply(clean_text)

train_data = traindf['text'].tolist()
train_labels = label_encoding(traindf['sentiment'].tolist())

test_data = testdf['text'].tolist()
test_labels = label_encoding(testdf['sentiment'].tolist())

vectorize_layer = tf.keras.layers.TextVectorization(max_tokens=VOCAB_SIZE, output_sequence_length=MAXLEN)

vectorize_layer.adapt(train_data)

train_data = vectorize_layer(train_data)
test_data = vectorize_layer(test_data)

model = tf.keras.Sequential([ 
    tf.keras.layers.Embedding(VOCAB_SIZE, 32), 
    tf.keras.layers.LSTM(32), 
    tf.keras.layers.Dense(3, activation="softmax")
])

model.compile(loss="categorical_crossentropy",optimizer="adam",metrics=['acc'])

history = model.fit(train_data, train_labels, epochs=20, validation_split=0.2)

word_index = vectorize_layer.get_vocabulary()

def encode_text(text):
    tokens = tf.strings.split(text)
    tokens = [word.decode('utf-8') for word in tokens.numpy()]  
    tokens = [word_index[word] if word in word_index else 0 for word in tokens]
    return sequence.pad_sequences([tokens], MAXLEN)[0]

reverse_word_index = {value: key for (key, value) in word_index.items()}

def decode_int(ints):
    PAD = 0
    text = ""
    for num in ints:
      if num != PAD:
        text += reverse_word_index[num] + " "
    return text[:-1]