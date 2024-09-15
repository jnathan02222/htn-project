import React, { useState } from 'react';

export default function Slider(){
    const [value, setValue] = useState(5);

    return (
        <div className="flex flex-col items-center px-6">
        <label htmlFor="slider" className="text-md font-medium mb-4">
            Articles: {value}
        </label>
        <input
            id="slider"
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            className="w-full h-1 bg-blue-300 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
        />
        </div>
    );
};
