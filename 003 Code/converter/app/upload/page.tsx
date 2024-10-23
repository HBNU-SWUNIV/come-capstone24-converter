'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from "next/navigation";
//import { FC } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Send, ZoomIn, ZoomOut, ChevronUp, ChevronDown } from "lucide-react";
import {useTypewriter, Cursor} from "react-simple-typewriter";
import { IconDots } from "@tabler/icons-react";
import { Bot, User } from 'lucide-react';

import Modal from '../../components/Modal';
import ChatLoader from '../../components/ChatLoader';
import styles from '../../styles/uploadPage.module.css'; // CSS 모듈 가져오기

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
    const handleSubmit = async (e) => {
      e.preventDefault();

  
      const currentQuestion = question.trim() // 현재 질문 저장
      if (!currentQuestion) return; // 빈 질문 무시

      setLoading(true);
      setQuestion(''); // 질문 폼 즉시 초기화 
      // 사용자의 질문만 기록
      const newQuestion = { question: currentQuestion, answer: null }; // answer는 null로 설정하여 비워둠
      setQaHistory((prevHistory) => [...prevHistory, newQuestion]); // 전에 질의응답 했던 기록 + 질문창만 
  
      try {
          const response = await fetch('http://127.0.0.1:2000/localQna/answer', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                  query: question,
                  // pdf: imageurl,
              })
          });
  
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
  
          // 응답이 있을 때 해당 질문에 답변을 추가
          setQaHistory((prevHistory) => {
              const updatedHistory = [...prevHistory];
              updatedHistory[updatedHistory.length - 1].answer = data.answer; // 마지막에 추가된 질문에 답변 설정
              return updatedHistory;
          });
  
      } catch (error) {
          console.error('Error fetching the answer:', error);
      } finally {
          setLoading(false);
      }
  };

   // Q&A 기록 영역에서 타이핑 효과를 적용
    const QaHistoryItem = ({ question, answer }) => {
        const [text] = useTypewriter({
            words: [answer],
            loop: 1,
            typeSpeed: 50, // 타이핑 속도 조정
            deleteSpeed: 0, // 삭제하지 않도록 설정
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
      <div className={styles.container}>
    
        {/* 번역 결과 팝업 모달 */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} translatedText={translatedText} />
          
        {/* PDF 뷰어 및 기능 메뉴바를 한 영역에 배치 */}
        <div className={styles.pdfSection}>
    
          {/* PDF 기능 메뉴바 */}
          <div className={styles.menuBar}> 
    
            {/* 페이지 크기 조절 */}
            <div className={styles.pagescale}>
              <button onClick={() => setPageScale(pageScale >= 4 ? 4 : pageScale + 0.1)} style={{ marginRight: '10px' }}>
                <ZoomIn />
              </button>
              <button onClick={() => setPageScale(pageScale <= 0.5 ? 0.5 : pageScale - 0.1)}>
                <ZoomOut />
              </button>
            </div>
    
            {/* 페이지 이동 UI */}
            <div className={styles.pagebutton}>
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
                className={styles.beforemenuButton}
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
                className={styles.pageInput}
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
                className={styles.aftermenuButton}
              >
                <ChevronDown />
              </button>
            </div>
          </div>
          
          {/* PDF 뷰어 창 */}
          <div
              className={styles.pdfViewer}
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
        <div className={styles.chatSection}>
          
        <div className={styles.historySection}>
          {qaHistory.map((qa, index) => (
            <div key={index} className={styles.messageContainer}>
            {/* 사용자 질문 */}
            <div className={`${styles.qaBubble} ${styles.qaQuestion}`}>
              <div className={styles.messageRow}>
                <User className={styles.usericon} />
                <div className={styles.messageContent}>
                  {qa.question}
                </div>
              </div>
            </div>

            {/* 항상 Bot 아이콘 표시 */}
            <div className={`${styles.qaBubble} ${styles.qaAnswer}`}>
              <div className={styles.messageRow}>
                <Bot className={styles.boticon} />
                <div className={styles.messageContent}>
                  {/* 로딩 중일 때는 ChatLoader, 응답이 있으면 답변 표시 */}
                  {qa.answer !== null ? (
                    qa.answer
                  ) : (
                    <ChatLoader size="32px" color="blue" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    
          </div>
    
          {/* 질문 입력 및 제출 버튼 */}
          <form 
            onSubmit={handleSubmit} 
            className={styles.form}
          >
            <input 
              type='text'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder='Enter your question'
              className={styles.input}
            />
          <button
              className={`${styles.submitButton} ${
                question.trim() ? styles.submitButtonEnabled : styles.submitButtonDisabled
                }`}
                type="submit"
                disabled={!question.trim()}
              >
              <Send className='size-4' />
            </button>
          </form>
        </div>
      </div>
    );
}