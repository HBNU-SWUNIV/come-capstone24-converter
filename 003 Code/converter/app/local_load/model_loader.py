# model_loader.py
from uuid import uuid4
import chromadb
from chromadb.utils import embedding_functions
from llama_cpp import Llama
from transformers import AutoTokenizer
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter


MODEL_PATH = 'app/local_load/model/llama-3-Korean-Bllossom-8B-Q4_K_M.gguf'
EMBED_MODEL_ID = 'BAAI/bge-m3'
CHROMA_CLIENT_PATH = "../../../db"

class RAG():

    # model = None
    tokenizer = None
    embeddings = None
    client = None
    collection = None

    def __init__(self, file_name: str):
        # Init model
        self.tokenizer = AutoTokenizer.from_pretrained('app/local_load/model')
        self.model = Llama(
            model_path=MODEL_PATH,
            n_ctx=4096,
            n_gpu_layers=-1,
            verbose=False
        )

        self.embeddings = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=EMBED_MODEL_ID,
            device = "cuda",
            normalize_embeddings = True,
        )

        self.client = chromadb.PersistentClient(path=CHROMA_CLIENT_PATH)        


    def add_chunks(self, path: str) -> None:
        print(f' [x] {path}')
        file_name = path.split('.')[0]
        self.collection = self.client.create_collection(
                name=file_name.split('/')[-1],
                embedding_function=self.embeddings,
                metadata={'hnsw:space': 'cosine'}
            )

        loader = PyPDFLoader(path)
        pages = loader.load()

        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=400, chunk_overlap=100
        )
        chunks = text_splitter.split_documents(pages)

        temp = {'page_content': [], 'metadata': []}
        for chunk in chunks:
            temp['page_content'].append(chunk.page_content)
            temp['metadata'].append(chunk.metadata)

        self.collection.add(
            documents=temp['page_content'],
            ids=[str(uuid4()) for _ in range(len(chunks))],
            metadatas=temp['metadata']
        )
        print("Document embedded")


    def generate_context(self, query_result):
        context = ""
        for doc in query_result['documents'][0]:
            context += f"{doc}\n"

        return context
    
    def generate_response(self, query):

        query_result = self.collection.query(
            query_texts=query,
            n_results=3
        )
        context = self.generate_context(query_result)

        SYSTEM_PROMPT = """
        당신은 ## Context에 주어진 정보를 base로 사용자의 질문에 대답하는 AI assistant입니다.
        항상 주어진 정보를 바탕으로 대답하고 정보가 없다면 모른다고 대답해주세요.
        대답은 간결하게 200자 이내의 한국어로 작성해 주세요.\n\n
        """
        USER_PROMPT = f"""
        ## Question: {query}\n\n
        ## Context: {context}\n
        """

        message = [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': USER_PROMPT}
        ]

        prompt = self.tokenizer.apply_chat_template(
            message,
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

        response_msg = self.model(prompt, repeat_penalty=1.3, **generation_kwargs)
        text = response_msg['choices'][0]['text'][len(prompt):]
        return text


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