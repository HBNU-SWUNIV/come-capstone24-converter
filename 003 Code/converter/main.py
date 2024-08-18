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


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

converter = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

converter.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

converter.include_router(s3r)
converter.include_router(translate)
converter.include_router(qna)

class summItem(BaseModel):
    url: str



if __name__ == "__main__":
    uvicorn.run(converter, host="0.0.0.0", port=2000)
