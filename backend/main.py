import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_utils import (
    generate_data_store,
    query_database
)
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "RAG Backend Running!"}


@app.post("/embed/{user_id}")
def embed_user_data(user_id: str):
    chunks = generate_data_store(user_id)
    return {"message": f"Embedded successfully for {user_id}", "chunks": chunks}


@app.post("/chat/{user_id}")
def chat(user_id: str, body: ChatRequest):
    response = query_database(body.question, user_id)
    return response


