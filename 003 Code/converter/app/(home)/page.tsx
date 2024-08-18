import React from "react";
import FileUploaderDrag from "../../components/FileUpload_drop";
import styles from "../../styles/component.module.css";

export const metadata = {
    title: "Home",
};

export default function HomePage() {
    return (
        
        <div className={styles.container}> 
            <FileUploaderDrag></FileUploaderDrag>  
        </div>
    );
}