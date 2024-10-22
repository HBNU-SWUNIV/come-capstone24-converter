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
    # region_name="ap-northeast-2"
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
    print("파일명 : {extrated_filename}")

    return JSONResponse(content={"url": url, "fileName": extracted_filename})

@s3r.get("/list", tags=['s3r'])
async def list_files():
    try:
        S3_BUCKET = BUCKET_NAME
        file_list = get_file_list_s3(S3_BUCKET)
        return JSONResponse(content=json.loads(file_list)) # 파일 목록 반환
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch file list: {str(e)}")

def generate_s3_url(bucket, key):
    return "https://s3-ap-northeast-2.amazonaws.com/%s/%s" % (
        bucket,
        urllib.parse.quote(key, safe="~()*!.'")  # URL 인코딩
    )

def lambda_handler(event, context):
    S3_BUCKET = "converter-upload-bucket"
    list = get_file_list_s3(S3_BUCKET)

    return {
        'statusCode': 200,
        'list': list
    }

# 파일 목록 추출
def get_file_list_s3(S3_BUCKET):
    s3 = boto3.client('s3')

    try:
        # 파일 목록 가져오기
        file_list = []

        # 버킷 내 객체 목록 호출
        obj_list = s3.list_objects(Bucket=S3_BUCKET)

        # 객체 목록이 비어있는지 확인
        if 'Contents' not in obj_list:
            return json.dumps([])  # 객체가 없을 경우 빈 리스트 반환

        # 객체 리스트 추출 및 정렬 (최신 업로드 순)
        contents_list = sorted(
            obj_list['Contents'], key=lambda x: x['LastModified'], reverse=True
        )

        # 최신 3개의 파일만 처리
        for content in contents_list[:3]:
            key = content['Key']
            size = content['Size']
            file_type = "Folder"

            # 파일 확장자 추출
            if "." in key:
                file_type = key.split(".")[-1]

            # 경로에서 파일명만 추출하여 리스트에 추가
            file_list.append({
                "fileName": key.split("/")[-1],  # 파일명만 추출
                "size": file_size_trans(size),   # 파일 크기 변환
                "url": generate_s3_url(S3_BUCKET, key)  # S3 파일 URL 생성
            })

        return json.dumps(file_list)  # JSON 형식으로 반환

    except Exception as e:
        print(f"Error: {e}")
        return False
    

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
