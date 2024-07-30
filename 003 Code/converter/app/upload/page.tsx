'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function UploadPage() {
    const [numPages, setNumPages] = useState(null); // @State, 현재 페이지 수  
    const [pageScale, setPageScale] = useState(2.0); // @State, 현재 Scale, 초기값 2.0
    const [selectedText, setSelectedText] = useState(''); // @State, 현재 드래그하여 선택한 텍스트
    const [translatedText, setTranslatedText] = useState(''); // @State, 현재 번역된 텍스트
    const [summarizedText, setSummarizedText] = useState(''); // @State, 현재 요약된 텍스트
    const [question, setQuestion] = useState(''); // @State, 현재 질문으로 입력한 텍스트
    const [answer, setAnswer] = useState(''); // @State, 현재 질문에 답변으로 나온 텍스트
    const [loading, setLoading] = useState(false); // @State, 현재 로딩 상태

    const searchParms = useSearchParams(); // 'home' 페이지에서 URL 쿼리
    const imageurl = searchParms.get("image_url"); // S3에 업로드 된 이미지의 URL 파싱 

    function onDocumentLoadSuccess({ numPages }) { // 페이지 불러오기 성공 시 현재 페이지로 설정 
        setNumPages(numPages);
    }

    const handleMouseUp = () => { // 마우스의 Drag Action
        const selection = window.getSelection(); // Drag한 영역 
        const selectedText = selection.toString(); // 해당 영역 문자열로 변환
        if (selectedText.length > 0) { // 변환 시 문자열이 비어있지 않다면 선택한 텍스트 설정 및 번역
            setSelectedText(selectedText);
            translateText(selectedText);
        }
    };

    useEffect(() => { //
        const textLayer = document.querySelector('.react-pdf__Page__textContent');
        if (textLayer) {
            textLayer.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            if (textLayer) {
                textLayer.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, [handleMouseUp]);

    const translateText = async (text) => { // 번역 기능 
        try {
            const response = await fetch('/api/translate', { // /api/translate 경로에 요청
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();  // json 형태로 요청에 대한 응답 받기
            setTranslatedText(data.translatedText); // 해당 응답의 translatedText 부분을 쿼리해서 현재 번역된 텍스트로 설정 
        } catch (error) { // 에러 처리 
            console.error('Error translating text:', error);
        }
    };

    const summarizePaper = async (imageurl) => { // 요약 기능 
        try {
            const response = await fetch("http://localhost:2000/summ", { // python 서버의 2000 포트의 summ 경로에 요청
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: imageurl }),
            });
            const data = await response.json(); // json 형태로 요청에 대한 응답 받기
            setSummarizedText(data.summarized); // 해당 응답의 summarized 부분을 쿼리해서 현재 요약된 텍스트로 설정 
        } catch (error) { // 에러 처리
            console.error('Error summarizing text: ', error)
        }
    };

    const handleSubmit = async (e) => { // 사용자가 입력한 내용을 제출
        e.preventDefault();  // 브라우저의 기본 동작을 막음
        setLoading(true); // 로딩 활성화 
        
        try {
            const reponse = await fetch('http://127.0.0.1:8000/llama/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({question})
            });
            const data = await reponse.json();
            setAnswer(data.answer)
            //setAnswer('hello')
        } catch(error) {
            console.error('Error fetching the answer:', error)
        }
        
     };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <div style={{ width: '50%', overflowY: 'auto', borderRight: '1px solid #ccc', padding: '10px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <button onClick={() => setPageScale(pageScale >= 3 ? 3 : pageScale + 0.1)}> 
                        Zoom In
                    </button>
                    <button onClick={() => setPageScale(pageScale <= 1 ? 1 : pageScale - 0.1)}>
                        Zoom Out
                    </button>
                </div>
                <Document file={imageurl} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={pageScale} />
                    ))}
                </Document>
            </div>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', padding: '10px', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                    <h2>Q&A</h2>
                    {loading && <p>Loading...</p>}
                    {translatedText && <p>Translated: {translatedText}</p>} {/* 번역된 텍스트 표시 */}
                    {answer && <p>Answer: {answer}</p>}
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderTop: '1px solid #ccc' }}>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                        style={{ flex: 1, padding: '10px', marginRight: '10px' }}
                    />
                    <button type="submit" style={{ padding: '10px' }}>
                        Ask
                    </button>
                </form>
            </div>
        </div>
    );
}
