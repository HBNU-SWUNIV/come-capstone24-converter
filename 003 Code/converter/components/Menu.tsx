import React from "react";
import ItemUpload from "./ItemUpload";
import ItemConvert from "./ItemConvert";
export default function Navbar(){
    return(
        <nav>
            <ul>
                <ItemUpload></ItemUpload>
                <ItemConvert></ItemConvert>
            </ul>
        </nav>
    )
}