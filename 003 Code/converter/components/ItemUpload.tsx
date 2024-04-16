'use client'
import React from "react";
//import TEST from "./test";
import FileUploader from "./FileUpload";
import { useState } from "react";
export default function ItemUpload(){
    const [test_arr, set_test_arr] = useState([<FileUploader></FileUploader>]);
   // const test_arr = [<TEST></TEST>, <TEST></TEST>];
    const addtest = () => {
        
        set_test_arr(prevArray => [...prevArray, <FileUploader></FileUploader>]);
    }
    const test_log = async () => {
        console.log('helo');
        //settest(test.concat(<TEST></TEST>))
    } 
    return(
        <div>
            {test_arr.map((component, index) => (
                <div key={index}>{component}</div>
            ))}
            <button onClick={addtest}>Add Compoent</button>
        </div>
      
    )
}