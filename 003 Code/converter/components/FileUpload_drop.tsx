// 파일 선택 창 추가
'use client'

import styles from "../styles/dropbox.module.css";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDropbox } from '@fortawesome/free-brands-svg-icons'


export default function FileUploaderDrag() {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        uploadFile(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {   
            const res = await fetch("http://127.0.0.1:2000/s3r/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {  
                console.error("Something went wrong, check your console.");
                return;
            }

            const data: { url: string } = await res.json();
            
            console.log("Received URL:", data.url); // URL이 정상적으로 받아졌는지 확인
            
              router.push(`/upload?image_url=${data.url}`);


        } catch (error) {
            console.error("Something went wrong, check your console.");
        }
    };

    return (
        <div className={styles.dropZone}>
            <div
                className={`${styles.dropZoneInner} ${isDragging ? 'isDragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <FontAwesomeIcon icon={faDropbox} />
                <p>Drag & Drop your file here</p>
                <input
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    type="file"
                    onChange={(e) => uploadFile(e.target.files[0])}
                />
            </div>
        </div>
    );
   
}
