import React from "react";
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
<<<<<<< HEAD
            <div className={button.buttonContainer}> 
        </div>
=======
            {/* <div className={button.buttonContainer}> 
            <TableExtract></TableExtract>
        </div> */}
>>>>>>> 9d0c8bbc333ee0634a825299bfc216a738370d30
    </div>
    );
}