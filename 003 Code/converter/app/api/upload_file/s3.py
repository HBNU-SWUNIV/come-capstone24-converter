import os
import urllib
import math
import json
# import tempfile
import requests
import aiofiles

import boto3
from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi import UploadFile, HTTPException
from fastapi.responses import JSONResponse
from boto3 import client
from botocore.exceptions import BotoCoreError, ClientError
from db import get_db_collection, add_to_collection

load_dotenv()

BUCKET_NAME = os.environ.get('S3_BUCKET')

s3r = APIRouter(prefix='/s3r')

s3_client = client( # AWS load 
    "s3",
    aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name="ap-northeast-2"
)

@s3r.post("/upload", tags=['s3r'])
async def upload(file: UploadFile):
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    filename = filename.replace(" ", "_")
    s3_key = f"uploads/11-04-2024/{filename}" # uploads/11-04-2024 경로에 저장 

    try:
        s3_client.upload_fileobj(file.file, BUCKET_NAME, s3_key)
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"S3 Upload Fails: {str(e)}")
    
    url = "https://s3-ap-northeast-2.amazonaws.com/%s/%s" % (
        BUCKET_NAME,
        urllib.parse.quote(s3_key, safe="~()*!.'"), # type: ignore
    )
    

    print("Generated URL:", url) # 저장 경로 출력   

    extracted_filename = s3_key.split("/")[-1]
    print(f"파일명 : {extracted_filename}")

    return JSONResponse(content={"url": url, "fileName": extracted_filename})

@s3r.get("/list", tags=['s3r'])
async def list_files():
    try:
        S3_BUCKET = BUCKET_NAME
        file_list = get_file_list_s3(S3_BUCKET)
        return JSONResponse(content=file_list) # 파일 목록 반환
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch file list: {str(e)}")

def generate_s3_url(bucket, key):
    return "https://s3-ap-northeast-2.amazonaws.com/%s/%s" % (
        bucket,
        urllib.parse.quote(key, safe="~()*!.'")  # URL 인코딩
    )


def get_file_list_s3(bucket_name):
    try:
        obj_list = s3_client.list_objects_v2(Bucket=bucket_name)
        if 'Contents' not in obj_list:
            return []  # 빈 리스트 반환

        contents_list = sorted(obj_list['Contents'], key=lambda x: x['LastModified'], reverse=True)
        file_list = [
            {
                "fileName": content['Key'].split("/")[-1],
                "size": file_size_trans(content['Size']),
                "url": generate_s3_url(bucket_name, content['Key'])
            }
            for content in contents_list[:3]
        ]
        return file_list
    except Exception as e:
        print(f"Error: {e}")
        return []
    

#파일 사이즈 단위 변환
def file_size_trans(size):
    if size > 1024*1024*1024:
        size = str(round(size / (1024*1024*1024), 1)) + 'GB'
    elif size > 1024*1024:
        size = str(round(size / (1024*1024), 1)) + 'MB'
    elif size > 1024:
        size = str(math.trunc(size / (1024))) + 'KB'
    else:
        size = str(size) + 'B'
    
    return size


@s3r.delete("/delete", tags=['s3r'])
async def delete_file(fileName: str):
    try:
        # 삭제할 S3 객체의 키 생성
        s3_key = f"uploads/11-04-2024/{fileName}"
        
        # S3 객체 삭제
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=s3_key)

        return JSONResponse(content={"message": f"File '{fileName}' deleted successfully."})
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
