from collections import OrderedDict
import json
import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.api.upload_file.s3 import s3r
from app.api.translate_text.translate import translate
from app.api.qna_bot.QnAbot import qna
# from app.local_load.model_loader import load_llm_model, load_embedding_model
from app.api.local_bot.local_qna import localQna
from contextlib import asynccontextmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# LLM 및 임베딩 모델을 저장할 전역 변수
llm_model = None
embedding_model = None

 

# def start():
#     global llm_model, embedding_model
#     llm_model = load_llm_model()
#     embedding_model = load_embedding_model()
#     logger.info("Models loaded successfully")

# def shutdown():
#     logger.info("Shutting down models")   

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # When service starts.
#     start()
    
#     yield
    
#     # When service is stopped.
#     shutdown()


# converter = FastAPI(lifespan=lifespan)
converter = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

converter.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

converter.include_router(s3r)
converter.include_router(translate)
converter.include_router(localQna)

class summItem(BaseModel):
    url: str


if __name__ == "__main__":
    uvicorn.run(converter, host="0.0.0.0", port=2000)
