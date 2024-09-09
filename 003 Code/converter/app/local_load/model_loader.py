# model_loader.py
# from langchain_ollama import ChatOllama
from transformers import AutoTokenizer
from llama_cpp import Llama
from langchain_community.embeddings import HuggingFaceBgeEmbeddings

# LLM 모델을 초기화하는 함수
def load_llm_model():
    # model_id = 'MLP-KTLim/llama-3-Korean-Bllossom-8B-gguf-Q4_K_M'
    tokenizer = AutoTokenizer.from_pretrained('app/local_load/model')
    llm = Llama(
        model_path='app/local_load/model/llama-3-Korean-Bllossom-8B-Q4_K_M.gguf', #다운로드받은 모델의 위치
        n_ctx=4096,
        n_gpu_layers=-1,        # Number of model layers to offload to GPU
        verbose=False
    )
    return llm, tokenizer

# 임베딩 모델을 초기화하는 함수
def load_embedding_model():
    hfe = HuggingFaceBgeEmbeddings(
        model_name="BAAI/bge-m3",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )
    return hfe