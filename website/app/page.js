"use client"
import {useState} from 'react';
import axios from 'axios';

export default function Home() {
  const  [website, setWebsite] = useState("");
  const submitForm = () => {
    axios.post('/search', {
      website : website
    })
    setWebsite("");
    
    
  }
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <form onSubmit={submitForm}> 
        <input name="website" onChange={(e)=>{setWebsite(e.target.value)}} value={website} placeholder="Enter a website!" className="rounded-md border-2 p-2 hover:border-indigo-200  min-w-[500px] focus:border-indigo-200 focus:outline-none"></input>
      </form>
    </div>
  );
}
