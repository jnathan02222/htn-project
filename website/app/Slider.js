import React, { useState } from 'react';

export default function Slider({value, setValue}){
    

    return (
        <div className="flex flex-col items-center mr-2">
            <input
              onChange={(e) => setValue(e.target.value)}
              value={value}
              placeholder="# of Articles"
              className="text-xl rounded-md border-2 p-2 hover:border-indigo-200 w-full focus:border-indigo-100 focus:outline-none"
              
            />
        </div>
    );
};
