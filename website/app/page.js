// page.js
"use client"
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BarChart from './barChart'; // Ensure the path is correct

export default function Home() {
  const [linkCount, setLinkCount] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const ws = useRef();
  // const [chartData, setChartData] = useState([0.5, 0.5, 0.5]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8081');
    ws.current.addEventListener("open", () => {
      console.log("Connected to server.");
    });

    ws.current.addEventListener("message", (event) => {
      const message = event.data;
      console.log("Received message: ", message);

      // Parse and set the number of links
      try {
        const parsedData = JSON.parse(message);
        if (parsedData.type === 'linkCount' && parsedData.count !== undefined) {
          setLinkCount(parsedData.count);
          console.log("Link Count:", parsedData.count);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
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
  }, []);

  useEffect(() => {
    if (linkCount !== null) {
      console.log("Updated link count:", linkCount);
    }
  }, [linkCount]);

  const [website, setWebsite] = useState("");
  const submitForm = (e) => {
    e.preventDefault();
    setShowForm(false);
    axios.post('/search', {
      website: website
    })
      .catch((error) => {
        console.error("Error during the search:", error);
      });
  };

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
    <div className="min-h-screen w-full flex justify-center p-24">
      <div style={{ width: '400px', height: '400px' }}>
        {/* <BarChart data={chartData} /> */}
      </div>
      {showForm ? (
        <form onSubmit={submitForm} className="flex flex-col items-center">
          <input
            name="website"
            onChange={(e) => setWebsite(e.target.value)}
            value={website}
            placeholder="Enter a website!"
            className="rounded-md border-2 p-2 hover:border-indigo-200 min-w-[500px] focus:border-indigo-200 focus:outline-none"
          />
          <button type="submit" className="mt-2 rounded-md bg-indigo-200 text-black py-2 px-4 hover:bg-indigo-300">Search</button>
        </form>
      ) : (
        <div className="mt-4 flex flex-col items-center">
          <div className="mt-4 text-lg">
            Number of links found: {linkCount}
          </div>
        </div>
      )}
    </div>
  );
}
