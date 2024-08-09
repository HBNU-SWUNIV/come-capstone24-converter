from fastapi import APIRouter
from pydantic import BaseModel
from transformers import pipeline

llamaR = APIRouter(prefix='/llama')

class Question(BaseModel):
    question: str

# LLaMA 모델 로드
model_name = "MLP-KTLim/llama-3-Korean-Bllossom-8B-Q4_K_M.gguf"
qa_pipeline = pipeline("question-answering", model=model_name, tokenizer=model_name)

@llamaR.post("/ask")
def ask_question(question: Question):
    context = "Your context here..."
    result= qa_pipeline(question=question.question, context=context)  # type: ignore
    
    return {"answer": result["answer"]}
