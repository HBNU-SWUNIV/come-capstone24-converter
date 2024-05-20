import React from "react";
import styles from "../../styles/navigation.module.css"
import Send from "../../components/SendtoEmail";
export default function UploadPage(){


    const imageurl = "https://converter-upload-bucket.s3.ap-northeast-2.amazonaws.com/uploads/11-04-2024/s3_test.png";
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