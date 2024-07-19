'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
// import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function UploadPage() {
    const [numPages, setNumPages] = useState(null);
    const [pageScale, setPageScale] = useState(2.0); // 기본 스케일 값을 2.0로 설정하여 기본 크기를 증가시킵니다.
    const [selectedText, setSelectedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [summarizedText, setSummarizedText] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const searchParms = useSearchParams();
    const imageurl = searchParms.get("image_url");

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleMouseUp = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if (selectedText.length > 0) {
            setSelectedText(selectedText);
            translateText(selectedText);
        }
    };

    useEffect(() => {
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
            const response = await fetch("http://localhost:2000/summ", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: imageurl }),
            });
            const data = await response.json();
            setSummarizedText(data.summarized);
        } catch (error) {
            console.error('Error summarizing text: ', error)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setAnswer('');

        // axios.post('/api/ollama', { question })
        //     .then((response) => {
        //         setAnswer(response.data.answer);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching answer:', error);
        //         setAnswer('Error fetching answer.');
        //     })
        //     .finally(() => {
        //         setLoading(false);
        //     });
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
