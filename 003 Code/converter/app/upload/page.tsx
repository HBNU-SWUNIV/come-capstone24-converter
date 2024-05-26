'use client'
import React from "react";
import styles from "../../styles/navigation.module.css"
import Send from "../../components/SendtoEmail";
import { useSearchParams } from "next/navigation";
export default function UploadPage(){
    const searchParms = useSearchParams();

    const imageurl = searchParms.get("image_url");
    console.log('hello')
    console.log(imageurl)
    return(
        <div>
            <h1>UploadPage</h1>
            <div className={styles.imageview}>
                <img src={imageurl} alt="Uploaded Image" style={{maxWidth: "100%"}}></img>
                <div>
                <Send></Send>
                </div>
            </div>
           
        </div>
    )
}