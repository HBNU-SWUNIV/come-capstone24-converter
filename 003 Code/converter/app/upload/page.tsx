'use client'
import React, { useState, useEffect, useCallback } from 'react';
// import styles from "../../styles/navigation.module.css"
import Send from "../../components/SendtoEmail";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSearchParams } from "next/navigation";
import {Document, Page, pdfjs} from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function UploadPage(){
    const [numPages, setNumPages] = useState(null); // 총 페이지수
    const [pageNumber, setPageNumber] = useState(1); // 현재 페이지
    const [pageScale, setPageScale] = useState(1); // 페이지 스케일
    const [selectedText, setSelectedText] = useState(''); // 드래그하여 선택된 텍스트
    const [translatedText, setTranslatedText] = useState(''); // 번역 텍스트
    const [summarizedText, setSummarizedText] = useState(''); // 요약 텍스트

    function onDocumentLoadSuccess({numPages}) {
        console.log(`numPages ${numPages}`);
        setNumPages(numPages);
    }

    const searchParms = useSearchParams();

    const imageurl = searchParms.get("image_url");

    const handleMouseUp = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if (selectedText.length > 0) {
            setSelectedText(selectedText);
            translateText(selectedText);
        }
    };

    useEffect(() => {  // React가 렌더링 될 때마다 실행되기에 동적 작업에 적합
        const textLayer = document.querySelector('.react-pdf__Page__textContent');
        if (textLayer) {
            textLayer.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            if (textLayer) {
                textLayer.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, [handleMouseUp, pageNumber]);

    const translateText = async (text) => {
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();
            setTranslatedText(data.translatedText);
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    const summarizePaper = async (imageurl) => {
        try {
            console.log(imageurl)
            const response = await fetch("192.168.0.200:2000/summ", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: imageurl }),
                
            });
            const data = await response.json();
            setSummarizedText(data.summarized);
            console.log(data.summarized);
        } catch (error) {
            console.error('Error summarizing text: ', error)
        }
    };
    
    return (
        <>
            {/* pdf 크기가 1280 * 720이 넘는 경우, overflow 처리 */}
            <div style={{width: '1280px', height: '720px', overflow: 'auto'}}>
                <Document file= {imageurl} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page width={1280} height={720} scale={pageScale} pageNumber={pageNumber}/>
                </Document>
            </div>
            <div>
                <p>
                    Page {pageNumber} of {numPages}
                </p>

                <p>페이지 이동 버튼</p>
                <button onClick={() => {
                    setPageNumber(numPages === pageNumber ? pageNumber : pageNumber + 1)
                }}> +
                </button>
                <button onClick={() => {
                    setPageNumber(pageNumber === 1 ? pageNumber : pageNumber - 1)
                }}> -
                </button>

                <p>페이지 스케일</p>
                <button onClick={() => {
                    setPageScale(pageScale === 3 ? 3 : pageScale + 0.1)
                }}> +
                </button>
                <button onClick={() => {
                    setPageScale((pageScale - 1) < 1 ? 1 : pageScale - 1)
                }}> -
                </button>
            </div>
            {selectedText && (
                <div>
                    <h2>Selected Text</h2>
                    <p>{selectedText}</p>
                    {translatedText && (
                        <>
                            <h2>Translated Text</h2>
                            <p>{translatedText}</p>
                        </>
                    )}
                  
                </div>
                
            )}
              <div>
                <Send></Send>
              </div>
              <div>
                <button onClick={() => {
                    summarizePaper(imageurl)
                }}> 요약 </button>
              </div>
              {summarizedText && (
                <div>
                    <h2>Summarize</h2>
                    <p>{summarizedText}</p>
                </div>
              )}
        </>
    );

}