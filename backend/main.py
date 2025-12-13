import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chatAPI")
async def chatAPI(req: ChatRequest):
    user_msg = req.message
    reply = f"**You said**: {user_msg}"
    return {"reply": reply}

@app.get("/health")
async def health():
    return {"status": "ok"}
if __name__ == "__main__":
    uvicorn.run(app)