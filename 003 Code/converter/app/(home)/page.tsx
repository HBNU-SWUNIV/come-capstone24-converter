import React from "react";
import TableExtract from "../../components/Table";
import FileUploader from "../../components/FileUpload";
import styles from "../../styles/navigation.module.css"
import FileUploaderDrag from "../../components/FileUpload_drop";
export const metadata = {
    title: "Home",
};


export default async function HomePage() {
  
    
    return (
        <div className={styles.container}> 
        <div className={styles.buttonContainer}> 
            {/* //<FileUploader></FileUploader> */}
            <FileUploaderDrag></FileUploaderDrag>
            <TableExtract></TableExtract>
        </div>
    </div>
    );
}