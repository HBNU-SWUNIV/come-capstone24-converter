import chromadb
from uuid import uuid4
from chromadb.utils import embedding_functions
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

CHROMA_DATA_PATH = "db/"
EMBED_MODEL = "BAAI/bge-m3"

client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
print("Chroma DB connected")

embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name=EMBED_MODEL, trust_remote_code=True
)
print("Embedding function loaded")


def get_db_collection(collection_name: str) -> chromadb.Collection:

    try:
        collection = client.get_collection(
            collection_name,
            embedding_function=embedding_func,
        )
    except ValueError as e:
        print(e)
        collection = client.create_collection(
            name=collection_name,
            embedding_function=embedding_func,
            metadata={"hnsw:space": "cosine"},
        )

    return collection


def add_to_collection(
        collection: chromadb.Collection, path: str
):
    loader = PyPDFLoader(path)
    pages = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(pages)

    tmp = {
    'page_content': [],
    'metadata': []
    }

    for chunk in chunks:
        tmp['page_content'].append(chunk.page_content)
        tmp['metadata'].append(chunk.metadata)

    collection.add(
        documents=tmp['page_content'],
        ids=[str(uuid4()) for _ in range(len(chunks))],
        metadatas=tmp['metadata'],
    )
    print("Documents loaded to DB")


def query_collection(collection: chromadb.Collection, query_text: str):

    query_results = collection.query(
        query_texts=[query_text],
        n_results=3,
    )

    return query_results


def generate_context(query_result: dict):
    context = ""
    for doc in query_result["documents"]:
        for i in doc:
            context += i
    return context