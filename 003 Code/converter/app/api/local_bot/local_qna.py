from fastapi import FastAPI, HTTPException, APIRouter, Request
import os
import tempfile
import requests
import chromadb
from uuid import uuid4
from fastapi import FastAPI, HTTPException, Request, APIRouter
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from app.local_load.model_loader import load_llm_model, load_embedding_model  # 모델 로드 함수 임포트
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain


localQna = APIRouter(prefix='/localQna')


# 모델을 한 번 로드하고 여러 요청에 재사용
llm, tokenizer = load_llm_model()
hfe = load_embedding_model()  # 임베딩 모델도 한 번 로드


# 프롬프트 설정 (일반 질문, 요약, 번역)
system_prompt_general = (
    "You are an assistant for general question-answering tasks. "
    "Provide accurate and concise information. Answer in Korean."
    "\n"
    # "{context}"
)


system_prompt_summary = (
    "You are an assistant specialized in summarizing academic papers. "
    "Summarize the provided text in three to five sentences. Answer in Korean."
    "\n"
    # "{context}"
)


system_prompt_translation = (
    "You are an assistant that translates English to Korean. "
    "Translate the following text accurately and naturally into Korean."
    "\n"
    # "{context}"
)


# 질의 분석 함수: 사용자의 요청이 요약인지, 번역인지 결정
def analyze_query(query):
    query_lower = query.lower()
    if "요약" in query_lower or "summarize" in query_lower:
        return "summary"
    elif "번역" in query_lower or "translate" in query_lower:
        return "translation"
    else:
        return "general"


def handle_retriever(path: str):
    client = chromadb.PersistentClient("../../../db")
    try:
        vector_store = Chroma(client=client,
                              collection_name=os.path.basename(path),
                              embedding_function=hfe,
                              create_collection_if_not_exists=False)
    except:
        loader = PyPDFLoader(path)
        pages = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(pages)

        vector_store = Chroma(
            client=client,
            collection_name=os.path.basename(path),
            embedding_function=hfe,
            create_collection_if_not_exists=True
        )
        vector_store.add_documents(documents=chunks, ids=[str(uuid4()) for _ in range(len(chunks))])

    retriever = vector_store.as_retriever()
    return retriever


# 프롬프트 선택 및 응답 생성 함수
def handle_query(query, retriever):
    # 질의 분석하여 요약, 번역, 일반 질문 구분
    query_type = analyze_query(query)
    
    if query_type == "summary":
        chosen_prompt = ChatPromptTemplate.from_messages([("system", system_prompt_summary), ("human", "{input}")])
    elif query_type == "translation":
        chosen_prompt = ChatPromptTemplate.from_messages([("system", system_prompt_translation), ("human", "{input}")])
    else:
        chosen_prompt = ChatPromptTemplate.from_messages([("system", system_prompt_general), ("human", "{input}")])
    
    # LLM 체인 생성
  
    # qa_chain = create_stuff_documents_chain(llm, chosen_prompt)
    # rag_chain = create_retrieval_chain(retriever, qa_chain)
    
    # 질문에 대한 답변 생성
    # response = rag_chain.invoke({"input": query})
    contexts = retriever.invoke(query)
    
    return contexts, chosen_prompt


def generate_text(prompt, instruction, contexts):
    tmp = ''
    for context in contexts:
        tmp += f"{context.page_content}\n"

    SYSTEM_PROMPT = prompt
    USER_PROMPT = f"""
    Question: {instruction}\n\n
    Context: {tmp}"""

    messages = [
        {"role": "system", "content": f"{SYSTEM_PROMPT}"},
        {"role": "user", "content": f"{USER_PROMPT}"}
    ]

    prompt = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    generation_kwargs = {
        "max_tokens":512,
        "stop":["<|eot_id|>"],
        "top_p":0.1,
        "temperature":0.1,
        "echo":True,
    }

    response_msg = llm(prompt, repeat_penalty=1.3, **generation_kwargs)
    text = response_msg['choices'][0]['text'][len(prompt):]
    return text


# FastAPI 경로 처리
@localQna.post("/answer")
async def generate_answer(request: Request):
    data = await request.json()
    text = data.get("text")
    imageurl = data.get("pdf")

    # 요청 본문에서 필수 필드 확인
    if not text or not imageurl:
        raise HTTPException(status_code=400, detail="Missing text or imageurl")
    
    # PDF 파일을 메모리로 로드
    response = requests.get(imageurl)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="PDF file not found")
    
    # PDF 데이터를 임시 파일로 저장
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(response.content)
        pdf_file_path = tmp_file.name

    # PyPDFLoader를 사용하여 PDF 파일의 텍스트 추출
    # loader = PyPDFLoader(pdf_file_path)
    # documents = loader.load()

    # # 텍스트 분할
    # text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    # splits = text_splitter.split_documents(documents)
    
    # # 임베딩 및 벡터 저장소 설정
    # vectorstore = Chroma.from_documents(documents=splits, embedding=hfe)
    # retriever = vectorstore.as_retriever()

    retriever = handle_retriever(pdf_file_path)

    # 임시 파일 삭제
    os.remove(pdf_file_path)

    # 사용자의 질의를 처리하고 응답 생성
    contexts, PROMPT = handle_query(text, retriever)
    result = generate_text(PROMPT, text, contexts)

    # 응답 반환
    return {"answer": result}