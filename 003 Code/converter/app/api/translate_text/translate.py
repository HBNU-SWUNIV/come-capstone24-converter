import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from boto3 import client
from botocore.exceptions import BotoCoreError, ClientError

load_dotenv()

translate= APIRouter(prefix='/translate') 

translate_client = client( 
    "translate",
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name=os.environ.get('AWS_REGION')
)

@translate.post("/translateText")
async def translate_text(request: dict):
    text = request.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    try:
        response = translate_client.translate_text(
            Text=text,
            SourceLanguageCode="auto",  # 자동으로 언어 감지
            TargetLanguageCode="ko"  # 한국어로 번역
        )
        translated_text = response.get("TranslatedText")
        print("Translation result:", translated_text)
        return JSONResponse(content={"translatedText": translated_text})
    
    except (BotoCoreError, ClientError) as e:
        print("Error translating text:", e)
        raise HTTPException(status_code=500, detail="Error translating text")

