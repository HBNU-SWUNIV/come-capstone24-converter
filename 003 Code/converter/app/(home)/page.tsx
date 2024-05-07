import Link from "next/link";
import React from "react";
import TableExtract from "../../components/Table";
import FileUploader from "../../components/FileUpload";
export const metadata = {
    title: "Home",
};


export default async function HomePage() {
  
    
    return (
        <div>
            <h1>main</h1>
            <FileUploader></FileUploader>
            <TableExtract></TableExtract>
        </div>
    );
}