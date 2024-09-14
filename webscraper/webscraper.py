import requests
from bs4 import BeautifulSoup
import sys

queue : list[str] = [sys.argv[1]]
max_articles = int(sys.argv[2])
articles = 0
visited = {}

def scrape_url(url : str):
    if(url in visited):
        return
    visited[url] = True

    global articles
    print(url)
    soup = BeautifulSoup(requests.get(url).text, 'html.parser')

    #Add links to queue
    for a in soup.find_all("a"):
        link : str = a.get('href')
        if(link == None or link == "#" or link == ""):
            continue
        if(link[0] == "/"):
            link = link.replace('/', url, 1)
        queue.append(link)

    #Determine if this is an article
    #TO DO: GET ALL TEXT AND CHECK FOR COMPANIES, then pass to ML
    #Live updates to the client
    articles += 1    

while(articles < max_articles and len(queue) > 0):
    scrape_url(queue[0])
    queue.pop(0)
