# model_loader.py
from langchain_ollama import ChatOllama
from langchain_community.embeddings import HuggingFaceBgeEmbeddings

# LLM 모델을 초기화하는 함수
def load_llm_model():
    llm = ChatOllama(
        model="llama3.1:8b",
        repeat_penalty=1.3,
        seed=2024,
        temperature=0.6,
        top_p=0.5,
    )
    return llm

# 임베딩 모델을 초기화하는 함수
def load_embedding_model():
    hfe = HuggingFaceBgeEmbeddings(
        model_name="BAAI/bge-m3",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )
    return hfe