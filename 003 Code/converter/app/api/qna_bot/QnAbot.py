import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.responses import JSONResponse
import logging

load_dotenv()

app = FastAPI()
qna = APIRouter(prefix='/QnAbot')
LLM_SERVER = os.getenv("LLM_SERVER")
# 도커 컨테이너 내의 FastAPI 서버 URL
DOCKER_API_URL = f"http://{LLM_SERVER}/model/answer"

@qna.post("/qna")
async def qna_bot(request: dict):
    text = request.get("text")
    
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    # 도커 컨테이너 내의 FastAPI 서버로 POST 요청 전송
    try:
        response = requests.post(DOCKER_API_URL, json={"text": text})
        response.raise_for_status()  # 이 줄에서 에러 발생 가능성 있음
    except requests.exceptions.RequestException as e:
        # 에러 발생 시 로그 출력
        logging.error(f"Error sending request to Docker FastAPI: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    # 도커 컨테이너에서 받은 응답을 그대로 반환
    answer = response.json().get("answer", "")
    
    if not answer:
        raise HTTPException(status_code=500, detail="Empty response from Docker FastAPI")
    
    return {"answer": answer}




