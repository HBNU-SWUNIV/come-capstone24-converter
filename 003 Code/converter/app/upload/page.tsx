'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function UploadPage() {
    const [numPages, setNumPages] = useState(null); // 현재 페이지 수
    const [pageScale, setPageScale] = useState(2.0); // 페이지 크기 
    const [selectedText, setSelectedText] = useState(''); // 사용자가 드래그로 선택한 텍스트
    const [translatedText, setTranslatedText] = useState(''); // 번역된 텍스트
    const [question, setQuestion] = useState(''); // 질의
    const [answer, setAnswer] = useState(''); // 응답
    const [loading, setLoading] = useState(false); // 기능 로딩 상태
    const [qaHistory, setQaHistory] = useState([]); // 질의응답 기록 

    const searchParms = useSearchParams();   // 이전 페이지에서 전달된 PDF 파일의 URL 가져오기
    const imageurl = searchParms.get("image_url");

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleMouseUp = () => {  // 사용자가 마우스를 놓은 시점에 선택된 텍스트를 번역 API에 전송
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if (selectedText.length > 0) {
            setSelectedText(selectedText);
            translateText(selectedText);
        }
    };

    useEffect(() => { // 사용자가 PDF 뷰어에서 드래그 이벤트를 감시
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

    const translateText = async (text) => { // 텍스트 번역 요청
        try {
            const response = await fetch('http://127.0.0.1:2000/translate/translateText', { // 번역 API 경로
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

    const handleSubmit = async (e) => { // 사용자가 질문을 제출하면 해당 질문을 처리하는 로직
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:2000/localQna/sendQes', { // Q&A 처리 API 경로
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: question })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setAnswer(data.answer);

            // Q&A 기록을 업데이트
            setQaHistory((prevHistory) => [...prevHistory, { question, answer: data.answer }]);
            
        } catch (error) {
            console.error('Error fetching the answer:', error)
        } finally {
            setLoading(false);
            setQuestion('');  // 입력 필드 초기화
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <div style={{ width: '50%', overflowY: 'auto', borderRight: '1px solid #ccc', padding: '10px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}> {/* 페이지 크기 조절 */}
                    <button onClick={() => setPageScale(pageScale >= 3 ? 3 : pageScale + 0.1)}>  
                        Zoom In
                    </button>
                    <button onClick={() => setPageScale(pageScale <= 1 ? 1 : pageScale - 0.1)}>
                        Zoom Out
                    </button>
                </div>
                <Document file={imageurl} onLoadSuccess={onDocumentLoadSuccess}>  {/* PDF 뷰어 */}
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={pageScale} />
                    ))}
                </Document>
            </div>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', padding: '10px', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                    <h2>Q&A</h2>
                    {loading && <p>Loading...</p>}

                    {/* Q&A 기록 표시 */}
                    {qaHistory.map((qa, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}> {/* 질문 텍스트 스타일 */}
                                <h3>Question:</h3>
                                <p>{qa.question}</p>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <h3>Answer:</h3>
                                <p>{qa.answer}</p>
                            </div>
                        </div>
                    ))}
                </div> {/* Q&A 표시 */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderTop: '1px solid #ccc' }}> 
                    {/* 질문 입력 폼 */}
                    <input 
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                        style={{ flex: 1, padding: '10px', marginRight: '10px' }}
                    /> 
                    <button type="submit" style={{ padding: '10px' }}> {/* 질문 제출 */}
                        Ask
                    </button>
                </form>
                <div>
                    {/* 번역된 텍스트 표시 */}
                    <h3>Translated Text:</h3>
                    <p>{translatedText}</p>
                </div>
            </div>
        </div>
    );
}