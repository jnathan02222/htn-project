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
  const [value, setValue] = useState(100);


  const ws = useRef();
  // const [chartData, setChartData] = useState([0.5, 0.5, 0.5]);
  const resultRef = useRef(null); // Create a ref for the result section

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
        console.log(message);
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
  // useEffect(() => {
  //   // Example: Update data every 3 seconds
  //   const interval = setInterval(() => {
  //     setChartData(prev => [
  //       Math.random(), // Simulate Positive
  //       Math.random(), // Simulate Negative
  //       Math.random(), // Simulate Neutral
  //     ]);
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

 

  return (
    <>
      <NavBar></NavBar>
      <div className="min-h-screen w-full flex justify-center p-24 bg-blend-multiply">
        
        <div className='max-w-[1000px] mt-10'>
          <div className='font-bold	text-5xl my-8 leading-tight	text-center'>Personalized stock insights from your favourite websites.</div>
          <div className='text-gray-500 text-2xl text-center'>MoneyMoves analyzes market sentiment from hundreds of articles to help you invest.</div>
          <div className='text-gray-500 text-2xl mb-10 text-center'>It all starts one link at a time.</div>
          <form onSubmit={submitForm} className="flex items-center">
            <Slider value={value} setValue={setValue}></Slider> 
            <input
              name="website"
              onChange={(e) => setWebsite(e.target.value)}
              value={website}
              placeholder="Enter any website!"
              className="text-xl rounded-md border-2 p-2 hover:border-indigo-200 w-full focus:border-indigo-100 focus:outline-none"
            />
            <button type="submit" className="text-xl ml-2 rounded-md bg-indigo-200 text-black py-2 px-4 hover:bg-indigo-300 shadow-lg">Search</button>
          </form>
           
          {
            showStats && 
            <div>
              <BarChart data={[1, 0.75, 0.5, 0.25, -0.25, -0.5, -0.75, -1, 1, 0.75, 0.5, 0.25, -0.25, -0.5, -0.75, -1]}></BarChart>
              <div className='flex justify-center mb-[40px]'>
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
