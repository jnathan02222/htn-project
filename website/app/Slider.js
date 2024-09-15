import React, { useState } from 'react';

export default function Slider({value, setValue}){
    

    return (
        <div className="flex flex-col items-center px-2 border-2 py-[6px] rounded-md mr-2">
            <label htmlFor="slider" className="text-md text-sm font-medium mb-2">
                Articles: {value}
            </label>
            <input
                id="slider"
                type="range"
                min="1"
                max="1000"
                value={value}
                onChange={(e)=>setValue(e.target.value)}
                className="w-full h-1 bg-blue-300 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            />
        </div>
    );
};
