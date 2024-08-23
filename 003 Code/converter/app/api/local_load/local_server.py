# model_server.py (FastAPI 1)
from fastapi import FastAPI, HTTPException, Request, APIRouter
from llama_cpp import Llama
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse


BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # 현재 파일의 절대 경로를 기준으로 모델 경로 계산 
MODEL_PATH = os.path.join(BASE_DIR, "../../mlp_llama_model/llama-3-Korean-Bllossom-8B-Q4_K_M.gguf") # 로컬 모델 경로 
localModel = APIRouter(prefix='/localModel') 
llm = Llama(model_path=MODEL_PATH, n_ctx=512, n_gpu_layers=-1) # 로컬 모델 로드, n = 512, layer = 1 

@localModel.post("/answer")
async def generate_answer(request: Request):
    data = await request.json()
    text = data.get("text")
    
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    # 모델에 질의
    messages = [  
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": text}
    ]
    
    # 생성된 응답
    response = llm.create_chat_completion(messages=messages)
    answer = response['choices'][0]['message']['content'] # type: ignore
    
    return {"answer": answer}
