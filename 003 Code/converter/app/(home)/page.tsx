import React from "react";
import TableExtract from "../../components/Table";
import styles from "../../styles/navigation.module.css"
import FileUploaderDrag from "../../components/FileUpload_drop";
export const metadata = {
    title: "Home",
};


export default async function HomePage() {
  
    
    return (
        <div className={styles.container}> 
        <h1>main</h1>
        <div className={styles.buttonContainer}> 
            <FileUploaderDrag></FileUploaderDrag>
            <TableExtract></TableExtract>
        </div>
    </div>
    );
}