'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from "next/navigation";
//import { FC } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Send, ZoomIn, ZoomOut, ChevronUp, ChevronDown } from "lucide-react";
import {useTypewriter, Cursor} from "react-simple-typewriter";
//import { IconDots } from "@tabler/icons-react";

import Modal from '../../components/Modal';
import ChatLoader from '../../components/ChatLoader';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function UploadPage() {
    const [totalPages, setTotalPages] = useState(0) //총 페이지 수
    const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호
    const [pageScale, setPageScale] = useState(1.0); // 페이지 크기 조정
    const [selectedText, setSelectedText] = useState(''); // 사용자가 드래그로 선택한 텍스트
    const [translatedText, setTranslatedText] = useState(''); // 번역된 텍스트
    const [question, setQuestion] = useState(''); // 질의
    const [answer, setAnswer] = useState(''); // 응답
    const [loading, setLoading] = useState(false); // 기능 로딩 상태
    const [qaHistory, setQaHistory] = useState([]); // 질의응답 기록 
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal 창 열림 상태
    const scroll = useRef(null); // PDF 뷰어 영역에 대한 참조
    const [scrollEventBlocked, setScrollEventBlocked] = useState(false);


    const searchParams = useSearchParams();   // 이전 페이지에서 전달된 PDF 파일의 URL 가져오기
    const imageurl = searchParams.get("image_url");

    function onDocumentLoadSuccess({ numPages }) { // PDF 로드 시 호출, 총 페이지 수 설정 및 콘솔에 메시지 출력
        setTotalPages(numPages);
        console.log(`총 페이지 수: ${numPages}`);
    }

      // 페이지가 변경될 때마다 콘솔에 메시지를 출력
      useEffect(() => {
        console.log(`현재 페이지: ${pageNumber}`);
      }, [pageNumber]); // pageNumber가 변경될 때마다 실행


    const handleMouseUp = () => {  // 사용자가 마우스를 놓은 시점에 선택된 텍스트를 번역 API에 전송
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if (selectedText.length > 0) {
            console.log("선택된 텍스트:", selectedText);  // 선택된 텍스트 출력
            setSelectedText(selectedText);
            translateText(selectedText);
        }
    };

    useEffect(() => { // 사용자가 PDF 뷰어에서 드래그 이벤트를 감시
        const textLayer = document.querySelector('.react-pdf__Page__textContent');

        if (textLayer) {
          console.log(`마우스 감지`);
            textLayer.addEventListener('mouseup', handleMouseUp);
        } else {
          console.log("마우스 감지 실패.");  // 텍스트 레이어가 없을 경우 로그
         }

        return () => {
            if (textLayer) {
                textLayer.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, [handleMouseUp]);

    
    const translateText = async (text) => { // 텍스트 번역 요청
        try {
            console.log("Translating text:", text); // 번역 요청 시 로그 출력
            const response = await fetch('http://127.0.0.1:2000/translate/translateText', { // 번역 API 경로
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();
            setTranslatedText(data.translatedText);
            setIsModalOpen(true); // Modal 창 열기
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };
    const handleSubmit = async (e) => { // 사용자가 질문을 제출하면 해당 질문을 처리하는 로직
      e.preventDefault();
      setLoading(true);

      try {
          const response = await fetch('http://127.0.0.1:2000/localQna/answer', { // Q&A 처리 API 경로
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                  text: question,
                  pdf: imageurl,
              })
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

   // Q&A 기록 영역에서 타이핑 효과를 적용
    const QaHistoryItem = ({ question, answer }) => {
        const [text] = useTypewriter({
            words: [answer],
            loop: 1,
        });

    };

    // 페이지 번호에 맞게 스크롤 이동
    const goToPage = (page) => {
      const target = scroll.current;
      const pageHeight = target.scrollHeight / totalPages;
      setScrollEventBlocked(true); // 스크롤 이벤트를 일시적으로 비활성화
      target.scrollTo({ top: (page - 1) * pageHeight, behavior: 'auto' });
      setTimeout(() => setScrollEventBlocked(false), 500);
  };



    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
    
        {/* 번역 결과 팝업 모달 */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} translatedText={translatedText} />
          
        {/* PDF 뷰어 및 기능 메뉴바를 한 영역에 배치 */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
    
          {/* PDF 기능 메뉴바 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', backgroundColor: '#f0f0f0', padding: '10px' }}> 
    
            {/* 페이지 크기 조절 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={() => setPageScale(pageScale >= 4 ? 4 : pageScale + 0.1)} style={{ marginRight: '10px' }}>
                <ZoomIn />
              </button>
              <button onClick={() => setPageScale(pageScale <= 0.5 ? 0.5 : pageScale - 0.1)}>
                <ZoomOut />
              </button>
            </div>
    
            {/* 페이지 이동 UI */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              {/* 이전 페이지 버튼 */}
              <button
                onClick={() => {
                  if (pageNumber > 1) {
                    const newPage = pageNumber - 1;
                    setPageNumber(newPage);
                    goToPage(newPage); // 해당 페이지로 스크롤 이동

                  }
                }}
                disabled={pageNumber <= 1}
                style={{ marginRight: '10px', padding: '5px', border: 'none', backgroundColor: '#f7f7f7', cursor: 'pointer' }}
              >
                <ChevronUp />
              </button>
              <input
                    type="text"
                    value={pageNumber || ''}
                    onChange={e => {
                    const v = e.target.value;
                    if (v === '') {
                        setPageNumber(1);
                     } else {
                        const numValue = parseInt(v, 10);
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= totalPages) {
                        setPageNumber(numValue);
                        goToPage(numValue); // 입력한 페이지로 스크롤 이동
                      }
                    }
                 }}
                min={1}
                max={totalPages}
                style={{
                  width: '40px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  marginRight: '10px',
                  padding: '5px',
                }}
              />
    
              {/* 다음 페이지 버튼 */}
              <button
                onClick={() => {
                  if (pageNumber < totalPages) {
                    const newPage = pageNumber + 1;
                    setPageNumber(newPage);
                    goToPage(newPage);
                  }
                }}
                disabled={pageNumber >= totalPages}
                style={{ marginLeft: '0px', padding: '5px', border: 'none', backgroundColor: '#f7f7f7', cursor: 'pointer' }}
              >
                <ChevronDown />
              </button>
            </div>
          </div>
          
          {/* PDF 뷰어 창 */}
          <div
              style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid #ccc', padding: '10px' }}
              ref={scroll} // 스크롤 요소에 대한 참조 추가
              onScroll={(e) => {
                const target = e.target as HTMLDivElement; // e.target을 HTMLDivElement로 명시적으로 캐스팅
                const scrollTop = target.scrollTop; // 스크롤의 상단 위치
                const scrollHeight = target.scrollHeight; // 전체 스크롤 가능한 높이
                const pageHeight = scrollHeight / totalPages; // 각 페이지의 높이 계산


                // 페이지 번호 계산
                let currentPage = Math.ceil(scrollTop / pageHeight);

                // currentPage가 totalPages를 초과하지 않도록 제한
                currentPage = Math.min(currentPage, totalPages - 1);

                // 페이지 번호 업데이트
                setPageNumber(currentPage + 1); 
              }}
            >
            <Document file={imageurl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(totalPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={pageScale} />
          ))}
        </Document>
          </div>
    
        </div>
    
        {/* 채팅 영역 */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', padding: '10px', backgroundColor: '#fff' }}>
          
          {/* Q&A 기록 영역 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px', marginBottom: '10px' }}>
            {qaHistory.map((qa, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#d1e7dd', padding: '10px', borderRadius: '10px', textAlign: 'right' }}>
                  <strong>You:</strong> {qa.question}
                </div>
                <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px', marginTop: '10px' }}>
                  <strong>Bot:</strong> {qa.answer}
                  <Cursor cursorColor='black' />
                </div>
              </div>
            ))}
    
            {/* Display loader in bot's bubble while waiting for response */}
            {loading && (
              <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px', marginTop: '10px' }}>
                <strong>Bot:</strong>
                <ChatLoader size='32px' color='blue' />
              </div>
            )}
    
          </div>
    
          {/* 질문 입력 및 제출 버튼 */}
          <form 
            onSubmit={handleSubmit} 
            style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#e0e0e0' }}
          >
            <input 
              type='text'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder='Enter your question'
              style={{ flex: 1, padding: '10px', marginRight: '10px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#fff' }}
            />
            <button
              type='submit'
              disabled={!question.trim()}
              style={{
                padding: '10px',
                backgroundColor: question.trim() ? '#333' : '#ccc',
                color: question.trim() ? 'white' : 'gray',
                cursor: question.trim() ? 'pointer' : 'not-allowed',
                borderRadius: '8px',
                border: 'none'
              }}
            >
              <Send className='size-4' />
            </button>
          </form>
        </div>
      </div>
    );
}