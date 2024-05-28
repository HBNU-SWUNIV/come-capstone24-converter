import React from "react";
import TableExtract from "../../components/Table";
import FileUploaderDrag from "../../components/FileUpload_drop";
import styles from "../../styles/component.module.css";
import button from "../../styles/button.module.css";
export const metadata = {
    title: "Home",
};

export default function HomePage() {
    return (
        
        <div className={styles.container}> 
            <FileUploaderDrag></FileUploaderDrag>
            {/* <div className={button.buttonContainer}> 
            <TableExtract></TableExtract>
        </div> */}
    </div>
    );
}