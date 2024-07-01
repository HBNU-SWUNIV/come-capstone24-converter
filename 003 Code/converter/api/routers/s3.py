import os
import urllib

import boto3
from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi import UploadFile, HTTPException
from fastapi.responses import JSONResponse
from botocore.exceptions import BotoCoreError, ClientError

load_dotenv()

BUCKET_NAME = os.environ.get('S3_BUCKET')

s3r = APIRouter(prefix='/api/s3r')

s3 = boto3.client('s3')

@s3r.post("/upload", tags=['s3r'])
async def upload(file: UploadFile):
    filename = file.filename
    s3_key = f"uploads/test/{filename}"

    try:
        s3.upload_fileobj(file.file, BUCKET_NAME, s3_key)
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"S3 Upload Fails: {str(e)}")
    
    url = "https://%s.s3.ap-northeast-2.amazonaws.com/%s" % (
        BUCKET_NAME,
        # urllib.parse.quote(s3_key, safe="~()*!.'"),
        s3_key,
    )
    # f"https://{BUCKET_NAME}.s3.{s3.get_bucket_location(Bucket=BUCKET_NAME)['LocationConstraint']}.amazonaws.com/{s3_key}"
    
    return JSONResponse(content={"URL": url})

# for bucket in s3.buckets.all():
#     print(bucket.name)

# with open('Lenna.png', 'rb') as data:
#     s3.Bucket(BUCKET_NAME).put_object(Key='Lenna.png', Body=data)