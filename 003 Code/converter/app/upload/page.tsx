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
    const [translatedText, setTranslatedText] = useState(''); // 번역
    const [question, setQuestion] = useState(''); // 질의
    const [answer, setAnswer] = useState(''); // 응답
    const [loading, setLoading] = useState(false); // 기능 로딩 
    const [qaHistory, setQaHistory] = useState([]); // 질의응답 기록 

    const searchParms = useSearchParams();   // 전 페이지인 home 페이지에서 업로드한 pdf의 저장 url 가져오기
    const imageurl = searchParms.get("image_url");

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleMouseUp = () => {  // 사용자가 마우스를 놓은 기점으로 선택된 텍스트들을 번역 api에 post 
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if (selectedText.length > 0) {
            setSelectedText(selectedText);
            translateText(selectedText);
        }
    };

    useEffect(() => { // 사용자가 PDF 뷰어에 주는 드래그 이벤트를 감시 및 반응
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

    const translateText = async (text) => { // 번역 
        try {
            const response = await fetch('http://127.0.0.1:2000/translate/translateText', { // 번역 api route 
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

    const handleSubmit = async (e) => { // 사용자가 질의를 제출하였을 때 local_qna route로 해당 내용 전송
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:2000/localQna/sendQes', { // local_qna route -> 해당 기능은 local_server route로 전송함 
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
            setQaHistory((prevHistory) => [...prevHistory, { question, answer: data.answer }]); // 질의 응답 기록 저장 
            
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
                <div style={{ textAlign: 'center', marginBottom: '10px' }}> {/* 페이지 이동 및 크기 조절 */}
                    <button onClick={() => setPageScale(pageScale >= 3 ? 3 : pageScale + 0.1)}>  
                        Zoom In
                    </button>
                    <button onClick={() => setPageScale(pageScale <= 1 ? 1 : pageScale - 0.1)}>
                        Zoom Out
                    </button>
                </div>
                <Document file={imageurl} onLoadSuccess={onDocumentLoadSuccess}>  {/* pdf 뷰어 */}
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
                </div> {/* QnA */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderTop: '1px solid #ccc' }}> 
                    {/* 질의 입력 폼 */}
                    <input 
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                        style={{ flex: 1, padding: '10px', marginRight: '10px' }}
                    /> 
                    <button type="submit" style={{ padding: '10px' }}> {/* 질의 제출 */}
                        Ask
                    </button>
                </form>
            </div>
        </div>
    );
}
