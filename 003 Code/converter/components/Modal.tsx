import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  translatedText: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, translatedText }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // 항상 최상단에 표시
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px", // 더 넓은 패딩
          borderRadius: "10px",
          border: "1px solid #333",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          maxWidth: "600px", // 모달 너비 확장
          width: "95%", // 화면에 따라 조정되는 너비
          maxHeight: "80vh", // 최대 높이 설정
          overflowY: "auto", // 스크롤 활성화
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 수평 가운데 정렬
        }}
        onClick={(e) => e.stopPropagation()} // 부모 클릭 이벤트 전파 차단
      >
        <h2 style={{ marginBottom: "10px" }}>번역 결과</h2>
        <div
          style={{
            whiteSpace: "pre-wrap", // 줄바꿈 유지
            wordWrap: "break-word", // 긴 단어 줄바꿈
            overflowWrap: "break-word",
            marginBottom: "20px",
          }}
        >
          {translatedText}
        </div>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            alignSelf: "center", // 버튼을 가운데 정렬
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default Modal;
