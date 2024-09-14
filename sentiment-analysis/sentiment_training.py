import pandas as pd
import tensorflow as tf
import numpy as np
import re
from keras.preprocessing import sequence
import sys
import json
import string

sys.stdout.reconfigure(encoding='utf-8')

VOCAB_SIZE = 25000
MAXLEN = 20

encoding = {
    'negative': [1, 0, 0],
    'neutral': [0, 1, 0], 
    'positive': [0, 0, 1]
}

def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'<.*?>', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(r'\d+', '', text)
    text = text.strip()
    text = re.sub(r'\s+', ' ', text)
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

train_data = np.array(vectorize_layer(train_data))
test_data = np.array(vectorize_layer(test_data))

model = tf.keras.Sequential([ 
    tf.keras.layers.Embedding(VOCAB_SIZE, 32), 
    tf.keras.layers.LSTM(32), 
    tf.keras.layers.Dense(3, activation="softmax")
])

model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=['acc'])

history = model.fit(train_data, train_labels, epochs=10, validation_split=0.2)

results = model.evaluate(test_data, test_labels)
print(results)

word_index = vectorize_layer.get_vocabulary()

with open('vocabulary.json', 'w') as f:
    json.dump(word_index, f)

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

# Save the model
model.save('my_model.keras')