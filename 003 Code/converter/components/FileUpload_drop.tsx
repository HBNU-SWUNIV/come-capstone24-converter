// 파일 선택 창 추가
'use client'

import styles from "../styles/dropbox.module.css";
import React, { useState, useRef, useEffect  } from "react";
import { useRouter } from "next/navigation";
import { X, Upload } from "lucide-react";

export default function FileUploaderDrag() {
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [recentFiles, setRecentFiles] = useState([]);
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
            
            const res2 = await fetch("http://127.0.0.1:localQna/upload", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pdf: data.url,
                })
            });

            router.push(`/upload?image_url=${data.url}`);


        } catch (error) {
            console.error("Something went wrong, check your console.");
        } finally {
             // 1초 후 로딩 종료
             setTimeout(() => setLoading(false), 1000);
             fetchRecentFiles(); // 업로드 후 목록 갱신
        }

    };

    const fetchRecentFiles = async () => {
        try {
            const res = await fetch("http://127.0.0.1:2000/s3r/list");
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setRecentFiles(data);
            } else {
                console.error("Failed to fetch recent files");
            }
        } catch (error) {
            console.error("Error fetching recent files:", error);
        }
    };

    useEffect(() => {
        fetchRecentFiles();
    }, []);


    const deleteFile = async (fileName) => {
        try {
            const res = await fetch(`http://127.0.0.1:2000/s3r/delete?fileName=${fileName}`, {
                method: "DELETE",
            });
    
            if (res.ok) {
                const data = await res.json();
                console.log(data.message); // 삭제 성공 메시지 확인
                fetchRecentFiles(); // 파일 삭제 후 목록 갱신
            } else {
                console.error("Failed to delete file.");
            }
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };


    return (
        <div className={styles.container}>
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
            <div className={styles.recentFiles}>
                <h3><b>Recent Files</b></h3>
                <div className={styles.fileList}>
                    {recentFiles.map((file, index) => (
                        <div key={index} className={styles.fileBlock}>
                            <X
                                className={styles.deleteIcon}
                                onClick={() => deleteFile(file.fileName)}
                            />
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <div className={styles.fileInfo}>
                                <p className={styles.fileName}>{file.fileName}</p>
                                <p className={styles.fileSize}>{file.size}</p>
                            </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
    );
}