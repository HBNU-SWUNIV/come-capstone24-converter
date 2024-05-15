'use client'

import styles from "../styles/dropbox.module.css";
import React, { useState } from "react";

export default function FileUploaderDrag() {
    const [isDragging, setIsDragging] = useState(false);

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

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload_s3/", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                console.error("Something went wrong, check your console.");
                return;
            }

            const data: { fileUrl: string } = await res.json();
            console.log(data);
            //setImageUrl(data.fileUrl);

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
            >
                <p>Drag & Drop your file here</p>
                <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={(e) => uploadFile(e.target.files[0])}
                />
            </div>
        </div>
    );
}

