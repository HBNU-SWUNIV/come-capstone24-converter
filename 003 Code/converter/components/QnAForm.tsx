
import React from 'react';
import { Send } from "lucide-react";

interface QnAFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  question: string;
  setQuestion: (question: string) => void;
}

const QnAForm: React.FC<QnAFormProps> = ({ handleSubmit, loading, question, setQuestion }) => {
  return (
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
  );
};

export default QnAForm;
