import requests
from bs4 import BeautifulSoup
from bs4.element import Comment
import sys
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

def predict(text, ticker):
    encoded_text = encode_text(text)
    pred = np.zeros((1, MAXLEN))
    pred[0] = encoded_text
    result = model.predict(pred)
    print("MODEL:"+ticker+":"+str(result[0][0]).replace("\r", ""))
    

queue : list[str] = [sys.argv[1]]
max_articles = int(sys.argv[2])
articles = 0
visited = {}

top_hundred = {
   "Arm": {
      "Ticker": "ARM"
   },
   "Linde": {
      "Ticker": "LIN"
   },
   "AstraZeneca": {
      "Ticker": "AZN"
   },
   "Baker Hughes": {
      "Ticker": "BKR"
   },
   "Broadcom": {
      "Ticker": "AVGO"
   },
   "Biogen": {
      "Ticker": "BIIB"
   },
   "Booking Holdings": {
      "Ticker": "BKNG"
   },
   "Cadence Design Systems": {
      "Ticker": "CDNS"
   },
   "Adobe": {
      "Ticker": "ADBE"
   },
   "Charter Communications": {
      "Ticker": "CHTR"
   },
   "Copart": {
      "Ticker": "CPRT"
   },
   "CoStar": {
      "Ticker": "CSGP"
   },
   "CrowdStrike": {
      "Ticker": "CRWD"
   },
   "Cintas": {
      "Ticker": "CTAS"
   },
   "Cisco": {
      "Ticker": "CSCO"
   },
   "Comcast": {
      "Ticker": "CMCSA"
   },
   "Costco": {
      "Ticker": "COST"
   },
   "CSX": {
      "Ticker": "CSX"
   },
   "Cognizant Technology": {
      "Ticker": "CTSH"
   },
   "Datadog": {
      "Ticker": "DDOG"
   },
   "Dexcom": {
      "Ticker": "DXCM"
   },
   "Diamondback Energy": {
      "Ticker": "FANG"
   },
   "Dollar Tree": {
      "Ticker": "DLTR"
   },
   "Electronic Arts": {
      "Ticker": "EA"
   },
   "ON Semiconductor": {
      "Ticker": "ON"
   },
   "Exelon": {
      "Ticker": "EXC"
   },
   "Trade Desk": {
      "Ticker": "TTD"
   },
   "Fastenal": {
      "Ticker": "FAST"
   },
   "GlobalFoundries": {
      "Ticker": "GFS"
   },
   "Meta": {
      "Ticker": "META"
   },
   "Fiserv": {
      "Ticker": "FI"
   },
   "Fortinet": {
      "Ticker": "FTNT"
   },
   "Gilead Sciences": {
      "Ticker": "GILD"
   },
   "Alphabet": {
      "Ticker": "GOOG"
   },
   "Google": {
      "Ticker": "GOOGL"
   },
   "Honeywell": {
      "Ticker": "HON"
   },
   "Illumina": {
      "Ticker": "ILMN"
   },
   "Intel": {
      "Ticker": "INTC"
   },
   "Intuit": {
      "Ticker": "INTU"
   },
   "Intuitive Surgical": {
      "Ticker": "ISRG"
   },
   "Marvell": {
      "Ticker": "MRVL"
   },
   "IDEXX": {
      "Ticker": "IDXX"
   },
   "Keurig Dr Pepper": {
      "Ticker": "KDP"
   },
   "KLA": {
      "Ticker": "KLAC"
   },
   "Kraft Heinz": {
      "Ticker": "KHC"
   },
   "Lam Research": {
      "Ticker": "LRCX"
   },
   "Lululemon": {
      "Ticker": "LULU"
   },
   "MercadoLibre": {
      "Ticker": "MELI"
   },
   "Marriott": {
      "Ticker": "MAR"
   },
   "Microchip Technology": {
      "Ticker": "MCHP"
   },
   "Mondelez": {
      "Ticker": "MDLZ"
   },
   "Moderna": {
      "Ticker": "MRNA"
   },
   "Monster Beverage": {
      "Ticker": "MNST"
   },
   "Microsoft": {
      "Ticker": "MSFT"
   },
   "Micron Technology": {
      "Ticker": "MU"
   },
   "Netflix": {
      "Ticker": "NFLX"
   },
   "Grail": {
      "Ticker": "GRAL"
   },
   "NVIDIA": {
      "Ticker": "NVDA"
   },
   "NXP Semiconductors": {
      "Ticker": "NXPI"
   },
   "Old Dominion Freight Line": {
      "Ticker": "ODFL"
   },
   "O’Reilly Automotive": {
      "Ticker": "ORLY"
   },
   "Paccar": {
      "Ticker": "PCAR"
   },
   "Palo Alto Networks": {
      "Ticker": "PANW"
   },
   "Paychex": {
      "Ticker": "PAYX"
   },
   "PDD Holdings": {
      "Ticker": "PDD"
   },
   "PayPal": {
      "Ticker": "PYPL"
   },
   "PepsiCo": {
      "Ticker": "PEP"
   },
   "Qualcomm": {
      "Ticker": "QCOM"
   },
   "Regeneron Pharmaceuticals Inc": {
      "Ticker": "REGN"
   },
   "Ross Stores": {
      "Ticker": "ROST"
   },
   "Starbucks": {
      "Ticker": "SBUX"
   },
   "Synopsys": {
      "Ticker": "SNPS"
   },
   "Tesla": {
      "Ticker": "TSLA"
   },
   "Texas Instruments": {
      "Ticker": "TXN"
   },
   "T-Mobile US": {
      "Ticker": "TMUS"
   },
   "Verisk Analytics": {
      "Ticker": "VRSK"
   },
   "Vertex Pharmaceuticals": {
      "Ticker": "VRTX"
   },
   "Warner Bros Discovery": {
      "Ticker": "WBD"
   },
   "Workday": {
      "Ticker": "WDAY"
   },
   "Xcel Energy": {
      "Ticker": "XEL"
   },
   "Zscaler": {
      "Ticker": "ZS"
   },
   "Automatic Data Processing": {
      "Ticker": "ADP"
   },
   "Airbnb": {
      "Ticker": "ABNB"
   },
   "AMD": {
      "Ticker": "AMD"
   },
   "Constellation Energy": {
      "Ticker": "CEG"
   },
   "Amazon": {
      "Ticker": "AMZN"
   },
   "Amgen": {
      "Ticker": "AMGN"
   },
   "American Electric Power Company": {
      "Ticker": "AEP"
   },
   "CDW": {
      "Ticker": "CDW"
   },
   "Coca-Cola": {
      "Ticker": "CCEP"
   },
   "Analog Devices": {
      "Ticker": "ADI"
   },
   "MongoDB": {
      "Ticker": "MDB"
   },
   "DoorDash": {
      "Ticker": "DASH"
   },
   "Roper Technologies": {
      "Ticker": "ROP"
   },
   "ANSYS": {
      "Ticker": "ANSS"
   },
   "Apple": {
      "Ticker": "AAPL"
   },
   "Applied Materials": {
      "Ticker": "AMAT"
   },
   "GE Healthcare Technologies": {
      "Ticker": "GEHC"
   },
   "ASML Holding NV": {
      "Ticker": "ASML"
   },
   "Atlassian": {
      "Ticker": "TEAM"
   },
   "Autodesk": {
      "Ticker": "ADSK"
   }
}

def relevant(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return None
    if isinstance(element, Comment):
        return None
    
    for name in top_hundred:
        if name in element:
            return top_hundred[name]["Ticker"]
    return None
    
def scrape_url(url : str):
    if(url in visited):
        return
    visited[url] = True

    global articles
    
    
    try:
        soup = BeautifulSoup(requests.get(url).text, 'html.parser')
    except:
        return

    print("SCRAPING: " + url)
    sys.stdout.flush()
    
    #Add links to queue
    for a in soup.find_all("a"):
        link : str = a.get('href')
        if(link == None or "#" in link or link == ""):
            continue
        if(link[0] == "/"):
            link = link.replace('/', url, 1)
        queue.append(link)

    #Determine if this is an article?
    #Get all text and check for companies then pass to ML
    texts = soup.findAll(text=True)
    print("PARSED:" + str(len(texts)))
    visible_texts = []
    for element in texts:
        ticker = relevant(element)
        #sys.stdout.flush()
        if(ticker):
            visible_texts.append([ticker, element.strip()])


    #Live updates to the client
    for line in visible_texts:
        try:
            predict(line[1], line[0])
            sys.stdout.flush()
        except:
            pass
        
    articles += 1    

while(articles < max_articles and len(queue) > 0):
    scrape_url(queue[0])
    queue.pop(0)
