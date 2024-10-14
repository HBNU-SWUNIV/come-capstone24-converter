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
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        zIndex: 1000,
        borderRadius: "10px",
        border: "1px solid #333",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h2>번역 결과</h2>
      <p>{translatedText}</p>
      <button
        onClick={onClose}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#333",
          color: "#fff",
          borderRadius: "8px",
        }}
      >
        닫기
      </button>
    </div>
  );
};

export default Modal;
