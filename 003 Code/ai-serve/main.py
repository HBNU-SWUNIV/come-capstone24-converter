import uvicorn
from fastapi import FastAPI

from routers.s3 import s3r
from services.summarize import summarize

app = FastAPI()

app.include_router(s3r)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/summ")
async def summ(file_url:str):
    summarized = summarize(file_url)

    return {"summarized": summarized}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=2000)

# fastapi dev main.py 