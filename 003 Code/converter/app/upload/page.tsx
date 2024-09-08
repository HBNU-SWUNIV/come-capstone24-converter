'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { FC } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Send, ZoomIn, ZoomOut, ChevronUp, ChevronDown } from "lucide-react";
import {useTypewriter, Cursor} from "react-simple-typewriter";
import { IconDots } from "@tabler/icons-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Modal 컴포넌트 정의
const Modal = ({ isOpen, onClose, translatedText }) => {
  if (!isOpen) return null;

  console.log("Modal Opened"); // 모달이 열릴 때 로그 출력

  
  return (
      <div style={{
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff', 
          padding: '20px', 
          zIndex: 1000, 
          borderRadius: '10px', 
          border: '1px solid #333',  // 테두리 생성
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'  // 그림자 추가
      }}>
          <h2>번역 결과</h2>
          <p>{translatedText}</p>
          <button onClick={onClose} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '8px' }}>닫기</button>
      </div>
  );
};

// 챗 로더
export const ChatLoader: FC = () => {
    return (
      <div className="flex flex-col flex-start">
        <div
          className={`flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-4 py-2 w-fit`}
          style={{ overflowWrap: "anywhere" }}
        >
          <IconDots className="animate-pulse" />
        </div>
      </div>
    );
  };

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
        console.log("텍스트 레이어를 찾지 못했습니다."); 
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


    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

          {/* 번역 결과 팝업 모달 */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} translatedText={translatedText} />

             {/* PDF 뷰어 창 */}
            <div style={{ width: '50%', overflowY: 'auto', borderRight: '1px solid #ccc', padding: '10px' }}>

            {/* PDF 기능 메뉴바 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', backgroundColor: '#f0f0f0', padding: "10px" }}> 

            {/* 페이지 크기 조절 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => setPageScale(pageScale >= 3 ? 3 : pageScale + 0.1)} style={{ marginRight: '10px' }}>
                <ZoomIn />
                </button>
                <button onClick={() => setPageScale(pageScale <= 1 ? 1 : pageScale - 0.1)}>
                <ZoomOut />
                </button>
            </div>

            {/* 페이지 이동 UI */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => {
                      if (pageNumber > 1) setPageNumber(pageNumber - 1);
                    }}
                    disabled={pageNumber <= 1}
                    style={{ marginRight: '10px', padding: '5px', border: 'none', backgroundColor: '#f7f7f7', cursor: 'pointer' }}
                  >
                    <ChevronUp />
                  </button>

                  <input
                      type="text"  // 숫자 입력을 텍스트로 변경하여 자유롭게 입력할 수 있도록 함
                      value={pageNumber || ''}  // 빈 값 허용
                      onChange={e => {
                        const v = e.target.value;

                        // 빈 문자열이면 페이지 번호를 초기화하지 않고, 빈 값으로 유지
                        if (v === '') {
                          setPageNumber(0);
                        } else {
                          const numValue = parseInt(v, 10);
                          // 숫자 범위가 유효하면 페이지 번호 설정
                          if (!isNaN(numValue) && numValue >= 1 && numValue <= totalPages) {
                            setPageNumber(numValue);
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
                      if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
                    }}
                    disabled={pageNumber >= totalPages}
                    style={{ marginLeft: '0px', padding: '5px', border: 'none', backgroundColor: '#f7f7f7', cursor: 'pointer' }}
                  >
                    <ChevronDown />
                  </button>
                </div>
              </div>
              
              {/*페이지 넘김*/}
              <Document file={imageurl} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} scale={pageScale} />
              </Document>

            <Document file={imageurl} onLoadSuccess={onDocumentLoadSuccess}>  {/* PDF 뷰어 */}
            {Array.from(new Array(totalPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={pageScale} />
            ))}
            </Document>
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
                <strong>Bot:</strong>
                {qa.answer} 
                <Cursor cursorColor='black' />
            </div>
            </div>
        ))}

        {/* Display loader in bot's bubble while waiting for response */}
        {loading && (
            <div style={{ backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "10px", marginTop: "10px" }}>
              <strong>Bot:</strong>
              <ChatLoader />
            </div>
          )}


        </div>


        {/* 질문 입력 및 제출 버튼 */}
        <form 
          onSubmit={handleSubmit} 
          style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#e0e0e0' }}
        >
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            style={{ flex: 1, padding: '10px', marginRight: '10px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#fff' }}
          />
          <button
            type="submit"
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
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}