"use client"
import {useState, useEffect, useRef} from 'react';
import axios from 'axios';

export default function Home() {
  const ws = useRef();
  useEffect(()=>{ 
    ws.current = new WebSocket('ws://localhost:8080');
    ws.current.addEventListener("open", (event) => {
      console.log("Connected to server.");
    });
  }, [])


  const  [website, setWebsite] = useState("");
  const submitForm = (e) => {
    e.preventDefault();
    axios.post('/search', {
      website : website
    })
    setWebsite("");
  }
  return (
    <div className="min-h-screen w-full flex justify-center  p-24">
      <form onSubmit={submitForm}> 
        <input name="website" onChange={(e)=>{setWebsite(e.target.value)}} value={website} placeholder="Enter a website!" className="rounded-md border-2 p-2 hover:border-indigo-200  min-w-[500px] focus:border-indigo-200 focus:outline-none"></input>
      </form>
    </div>
  );
}
