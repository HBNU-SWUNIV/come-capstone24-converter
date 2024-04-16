'use client'
import React from "react";
//import TEST from "./test";
import FileConverter from "./FileConvert";
import { useState } from "react";
export default function ItemConvert(){
    const [convert_arr, set_convert_arr] = useState([<FileConverter></FileConverter>]);
   // const test_arr = [<TEST></TEST>, <TEST></TEST>];
    const addtest = () => {
        
        set_convert_arr(prevArray => [...prevArray, <FileConverter></FileConverter>]);
    }
    const test_log = async () => {
        console.log('helo');
        //settest(test.concat(<TEST></TEST>))
    } 
    return(
        <div>
            {convert_arr.map((component, index) => (
                <div key={index}>{component}</div>
            ))}
            <button onClick={addtest}>Add Coonverter</button>
        </div>
      
    )
}