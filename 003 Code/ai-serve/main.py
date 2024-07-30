from collections import OrderedDict
import json
import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from routers.s3 import s3r
from routers.llama import llamaR
from services.summarize import summarize


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(s3r)
logging.info('s3 router included')
app.include_router(llamaR)
logging.info('llama router included')
@app.get("/")
async def root():
    return {"message": "Hello World"}

class summItem(BaseModel):
    url: str

@app.post("/summ")
async def summ(item: summItem, response_model=summItem):
    item_dict = item.dict()
    summarized = summarize(item.url)
    # summarized = summarize('/home/tylee/caps/003 Code/ai-serve/1705.01844.pdf')
    item_dict.update({"summarized": summarized})

    return item_dict

if __name__ == "__main__":
    uvicorn.run(app, host="0", port=2000)

# fastapi dev main.py 