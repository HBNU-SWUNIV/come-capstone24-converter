// 파일 선택 창 추가
'use client'

import styles from "../styles/dropbox.module.css";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faDropbox } from '@fortawesome/free-brands-svg-icons'
import { Upload } from "lucide-react";

export default function FileUploaderDrag() {
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false); // 로딩 상태
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
            setLoading(true);  //로딩 시작
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
        } finally {
            setLoading(false); // 로딩 종료
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
                {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-lg font-medium text-black">Processing...</span>
                  </div>
                  
                ) : (
                    <>
                        <div className={styles.iconWrapper}>
                            <Upload size={40} />
                        </div>
                        <p>Drag & Drop your file here</p>
                        <input
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            type="file"
                            onChange={(e) => uploadFile(e.target.files[0])}
                        />
                    </>
                )}
            </div>
        </div>
    );
}