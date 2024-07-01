from fastapi import FastAPI

from routers.s3 import s3r

app = FastAPI()

app.include_router(s3r)

@app.get("/api")
def hello_world():
    return {"message": "Hello World"}