import os
import requests
from dotenv import load_dotenv

from sentence_transformers import SentenceTransformer
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate

load_dotenv()

DATA_PATH = "data"
CHROMA_PATH = "ChromaDatabases"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# ============================
#  EMBEDDING CLASS (FIXED)
# ============================

class LocalEmbedding:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed_documents(self, texts):
        return self.model.encode(texts).tolist()

    def embed_query(self, text):
        return self.model.encode([text])[0].tolist()

embedding_fn = LocalEmbedding()


# ============================
# CHAT MODEL (OpenRouter)
# ============================

CHAT_MODEL = "mistralai/mistral-7b-instruct"

def openrouter_chat(prompt):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": CHAT_MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }

    res = requests.post(url, json=payload, headers=headers)
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"]


# ============================
# LOAD + SPLIT DOCUMENTS
# ============================

def load_docs():
    loader = DirectoryLoader(DATA_PATH, glob="*.txt")
    return loader.load()


def split_docs(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=100,
        chunk_overlap=20,
        length_function=len,
        add_start_index=True
    )
    return splitter.split_documents(documents)


# ============================
# SAVE TO CHROMA
# ============================

def save_to_chroma(chunks, user_id):

    db = Chroma.from_documents(
        chunks,
        embedding_fn,
        persist_directory=CHROMA_PATH,
        collection_name=user_id.lower()
    )

    # db.persist()
    return len(chunks)


def generate_data_store(user_id):
    docs = load_docs()
    chunks = split_docs(docs)
    return save_to_chroma(chunks, user_id)


# ============================
# QUERY RAG
# ============================

PROMPT_TEMPLATE = """
Use ONLY this context:

{context}

---
Reply like the user would.
One line.
Use their tone + emojis.

Q: {question}
"""

def query_database(query_text, user_id):

    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_fn,
        collection_name=user_id.lower()
    )

    results = db.similarity_search_with_relevance_scores(query_text, k=20)

    if len(results) == 0:
        return {"response": "No relevant context found.", "sources": []}

    context = "\n---\n".join([doc.page_content for doc,_ in results])
    sources = [doc.metadata.get("source") for doc,_ in results]

    prompt = PROMPT_TEMPLATE.format(
        context=context,
        question=query_text
    )

    reply = openrouter_chat(prompt)

    return {
        "response": reply,
        "sources": sources
    }
