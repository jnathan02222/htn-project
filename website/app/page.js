// page.js
"use client"
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavBar from './Navbar';
import BarChart from './barChart'
import Slider from './Slider';

export default function Home() {
  const actualSentenceCount = useRef(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const actualArticleCount = useRef(0);
  const [articleCount, setArticleCount] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [value, setValue] = useState();

  const [data, setData] = useState({});
  const [labels, setLabels] = useState([]);

  const ws = useRef();
  // const [chartData, setChartData] = useState([0.5, 0.5, 0.5]);
  const resultRef = useRef(null); // Create a ref for the result section

  function getWebsiteName(){
    return websiteRef.current.replace("https://", "").replace("http://", "");
  }
  /*
  useEffect(()=>{
    console.log(data)
  }, [data])*/

  useEffect(()=>{ 
    ws.current = new WebSocket('ws://localhost:8081/ws');
    ws.current.addEventListener("open", (event) => {
      console.log("Connected to server.");
    });

    ws.current.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if(message.sentencesParsed){
        actualSentenceCount.current += parseInt(message.sentencesParsed.replace('\r', ''));
      }else if(message.articlesAnalyzed){
        actualArticleCount.current += parseInt(message.articlesAnalyzed.replace('\r', ''));
      }else if(message.ticker){
        setLabels(prev=>{
          if(prev.includes(message.ticker)){
            return prev;
          }
          return [...prev, message.ticker];
        })
        //Data
          //Website
            //Ticker
              //Average
              //Count
        const websiteName = getWebsiteName();

        setData((prev)=>{
          var value = 0;
          var amount = 0;
          if(data[websiteName] && data[websiteName][message.ticker]){
            value = data[websiteName][message.ticker][0];
            amount = data[websiteName][message.ticker][1];
          }
          return {
            ...prev,
            [websiteName] : {
              ...prev[websiteName],
              [message.ticker] : [(message.value + value*amount)/(amount+1), amount + 1]
            }
          }
          
          
        })

        
        
      }
      
    });

    

    ws.current.addEventListener("close", () => {
      console.log("Disconnected from server.");
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [])

  const animationRef = useRef();
  useEffect(()=>{
    const animation = () => {
      setSentenceCount(prev => {
        if(actualSentenceCount.current - prev < 1){
          return actualSentenceCount.current;
        }
        if(prev < actualSentenceCount.current){
          return prev + (actualSentenceCount.current - prev)/5;
        }else{
          return prev;
        }
      });
      setArticleCount(prev => {
        if(actualArticleCount.current - prev < 1){
          return actualArticleCount.current;
        }
        if(prev < actualArticleCount.current){
          return prev + (actualArticleCount.current - prev)/5;
        }else{
          return prev;
        }
      });
      animationRef.current = window.requestAnimationFrame(animation);
      
    }
    animation();
    return () => {
      cancelAnimationFrame(animationRef.current);
    }
  }, [])
  

  const [website, setWebsite] = useState("");
  const websiteRef = useRef("");
  const submitForm = (e) => {
    e.preventDefault();
    actualSentenceCount.current = 0;
    setSentenceCount(0);
    actualArticleCount.current = 0;
    setArticleCount(0);
    setShowStats(true);

    setTimeout(()=>{
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 500);

    if(ws.current){
      ws.current.send(JSON.stringify({website : (website.includes('http://') || website.includes('https://')) ? website : "http://" + website, articles: value}));
    }

    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  return (
    <>
      <NavBar></NavBar>
      <div className="min-h-screen w-full flex justify-center p-24 bg-blend-multiply">
        
        <div className='max-w-[1000px] mt-10'>
          <div className='font-bold	text-5xl my-8 leading-tight	text-center'>Personalized stock insights from your favourite websites.</div>
          <div className='text-gray-500 text-2xl text-center'>MoneyMoves analyzes market sentiment from hundreds of articles to help you invest.</div>
          <div className='text-gray-500 text-2xl mb-10 text-center'>It all starts one link at a time.</div>
          <form onSubmit={submitForm} className="flex items-center">
            <input
              onChange={(e) => {setValue(e.target.value)}}
              value={value}
              placeholder="# of Articles"
              className="text-xl rounded-md border-2 p-2 hover:border-indigo-200 w-[200px] focus:border-indigo-100 focus:outline-none mr-2"
              required={true}
              type="number"
              min="1"
              max="1000"
              step="1"
            />
            <input
              name="website"
              onChange={(e) => {setWebsite(e.target.value); websiteRef.current = e.target.value}}
              value={website}
              placeholder="Enter any website!"
              className="text-xl rounded-md border-2 p-2 hover:border-indigo-200 w-full focus:border-indigo-100 focus:outline-none"
              required={true}
            />
            <button type="submit" className="text-xl ml-2 rounded-md bg-indigo-200 text-black py-2 px-4 hover:bg-indigo-300 shadow-lg">Search</button>
          </form>
           
          {
            showStats && 
            <div>
              <BarChart data={data} labels={labels}></BarChart>
              <div className='flex justify-center mb-[50px]'>
                <div className="mt-4 text-3xl flex gap-1 items-end mr-20">
                  <div className="text-4xl font-bold items-baseline">{Math.floor(sentenceCount)}</div>
                  <div>sentences parsed</div>
                </div>
                <div className="mt-4 text-3xl flex gap-1 items-end">
                  <div className="text-4xl font-bold items-baseline">{Math.floor(articleCount)}</div>
                  <div>articles analyzed</div>
                </div>
              </div>
            </div>
          } 
        </div>
      </div>
      
    </>
  );
}
