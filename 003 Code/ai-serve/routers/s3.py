import os
import urllib

from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi import UploadFile, HTTPException
from fastapi.responses import JSONResponse
from boto3 import client
from botocore.exceptions import BotoCoreError, ClientError

load_dotenv()

BUCKET_NAME = os.environ.get('S3_BUCKET')

s3r = APIRouter(prefix='/s3r')

s3_client = client(
    "s3",
    aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY'),
    # region_name="ap-northeast-2"
)

@s3r.post("/upload", tags=['s3r'])
async def upload(file: UploadFile):
    filename = "test.jpg"
    s3_key = f"uploads/test/{filename}"

    try:
        s3_client.upload_fileobj(file.file, BUCKET_NAME, s3_key)
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"S3 Upload Fails: {str(e)}")
    
    url = "https://s3-ap-northeast-2.amazonaws.com/%s/%s" % (
        BUCKET_NAME,
        urllib.parse.quote(s3_key, safe="~()*!.'"),
    )
    return JSONResponse(content={"url": url})