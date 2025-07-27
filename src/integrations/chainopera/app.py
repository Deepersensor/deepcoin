# Sample FastAPI agent for ChainOpera integration
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    question: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(query: Query):
    # Dummy logic for demonstration
    return {"answer": f"You asked: {query.question}"}
