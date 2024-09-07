<local_model_test>

## 환경 준비
 - npm install
 - venv 가상환경 접속 
 - pip install -r requirements.txt


## 서버 실행
 - npm run dev (Client)
 - uvicorn main:converter --reload --host 0.0.0.0 --port 2000 (API, ModelServer)