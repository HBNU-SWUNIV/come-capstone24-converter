# 한밭대학교 컴퓨터공학과  컨버터팀

#  주제 : 학습자를 위한 AI 기반 논문 분석 지원 웹서비스 

**팀 구성**
- 20197128 이영호 
- 20181597 이태윤
- 20217134 박민이

## <u>Teamate</u> Project Background
- ### 필요성
  - 논문을 열람하여 학습하는 사용자들에게 원하는 내용 요약 및 번역을 제공하는 서비스이다.


    사용자가 PDF 형식의 논문을 업로드하면 뷰어와 함께 ChatBot 형식의 질의응답 창이 주어진다.

    사용자가 특정 내용에 대한 요약 관련 질의를 LLM 모델이 논문 내용이 저장된 벡터 스토어에 넘겨줌으로써

    벡터 거리값을 통한 내용과 관련된 내용을 사용자는 볼 수 있게 된다.

    
  - 기존 상용 모델이 아닌 오픈 소스 LLM Model을 사용하였기에 상대적으로 적은 비용을 통해 서비스를 구현할 수 있었다.
- ### 기존 해결책의 문제점
  - 특정 논문의 기본 지식의 부족으로 인해 학습자들은 내용파악에 어려움을 겪고 있다.
  - 내용이 길어 원하는 정보를 찾는데 어려움을 겪고 있다. 
  
## System Design
  - ### System Requirements
    - Next.js 기반의 웹 구축 및 FastAPI로 이벤트 처리 - 문서 업로드, 번역 요청, 모델 로드 및 질의응답 
    - React를 통해 사용자 친화적인 UI
    - 사용자의 문서를 AWS - S3에 저장 및 불러오기, 한국어가 학습된 llama-3-Korean-Bllossom-8B 및 벡터 저장소를 생성하는 BAAI/bge-m3로 챗봇 기능 구현
    
## Case Study
  - ### Description
  

## System Architecture

<img width="566" alt="image" src="https://github.com/user-attachments/assets/f809ffc0-9de0-4ec3-aa70-d2754ac1dd29">


  
## Conclusion - ChatGPT 와의 성능 비교
   <img width="997" alt="image" src="https://github.com/user-attachments/assets/43adee51-66a9-4ccd-9ff5-d011e56fae9c">


   상용 모델보다 다소 성능이 떨어지는 모습을 보이지만 사용자에게 유의미한 결과를 도출한 것을 보여준다. 

  
  
## Project Outcome
- ### 20XX 년 OO학술대회 
