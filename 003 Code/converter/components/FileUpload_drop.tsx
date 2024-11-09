'use client';

import styles from "../styles/dropbox.module.css";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Upload } from "lucide-react";

interface FileData {
  fileName: string;
  size: string;
  url: string;
}

export default function FileUploaderDrag() {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [files, setFiles] = useState<FileData[]>([]); // 파일 상태
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 파일 목록을 가져오는 함수
  const fetchFiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:2000/s3r/list");
      if (!response.ok) {
        throw new Error("Failed to fetch file list");
      }
      const data: FileData[] = await response.json();
      setFiles(data); // 파일 상태 업데이트
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles(); // 컴포넌트 마운트 시 파일 목록 가져오기
  }, []);

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
    if (file) uploadFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {   
            setLoading(true);  //로딩 시작
            
            fetch('http://127.0.0.1:2000/s3r/upload', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        console.error("Something went wrong, check your console.");
                        return;
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('첫 요청 데이터: ', data);

                    const fileUrl: {url: string} = data.url;
                    return fetch('http://127.0.0.1:2000/localQna/upload', {
                        method: 'POST',
                        headers: {
                            "Access-Control-Allow-Headers": "*",
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pdf: fileUrl
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            console.error("Something went wrong, check your console.");
                            return;
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('두번째 요청 데이터: ', data);

                        if (data.answer == 'ok') {
                            return router.push(`/upload?image_url=${fileUrl}`)};
                    })
                    .catch(error => {
                        console.error('Fetch 오류: ', error) // 안녕
                    })
                })
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
                // setRecentFiles(data); none 
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
          className={`${styles.dropZoneInner} ${isDragging ? "isDragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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
                onChange={handleFileInputChange}
              />
            </>
          )}
        </div>
      </div>

      <div className={styles.recentFiles}>
        <h3><b>Recent Files</b></h3>
        <div className={styles.fileList}>
          {files.map((file, index) => (
            <div key={index} className={styles.fileBlock}>
              <X className={styles.deleteIcon} onClick={() => deleteFile(file.fileName)} />
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