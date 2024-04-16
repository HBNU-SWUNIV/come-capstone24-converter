import React from "react";
import Navbar from "../../components/Menu";
import FileUploader from "../../components/FileUpload";
export default function UploadPage(){
    const handleSubmit = (formData) =>{

    }
    return(
        <div>
            <h1>UploadPage</h1>
            <div>
                <FileUploader></FileUploader>
                <Navbar></Navbar>
            </div>
        </div>
    )
}