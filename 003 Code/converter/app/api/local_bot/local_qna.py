from fastapi import FastAPI, HTTPException, APIRouter, Request
from app.api.local_load.local_server import generate_answer  # type: ignore # 모델 서버의 핸들러를 직접 호출

localQna = APIRouter(prefix='/localQna')

@localQna.post("/sendQes")
async def qna_bot(request: Request):
    data = await request.json()
    text = data.get("text")
    
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    # 모델 서버의 엔드포인트 함수를 내부적으로 호출
    answer_response = await generate_answer(request)  # FastAPI의 핸들러 호출
    
    return answer_response  # 모델 서버의 응답을 그대로 반환
