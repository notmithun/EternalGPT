import asyncio
from asyncio.events import AbstractEventLoop
import logging
import uvicorn

logger = logging.getLogger("uvicorn")
logger.info("Started logger")
logger.info("Importing...")
from dotenv import load_dotenv
from os import getenv
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, Result
from db import engine, get_db
from models import Base, Chat, Message
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from pydantic import BaseModel
from google import genai
from typing import Any

logger.info("Importing is completed")
load_dotenv(".//.env")
API_KEY = getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    await engine.dispose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.10.8:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("FastAPI is ready!")
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Something went wrong",
            "code": 500
        }
    )


class ChatRequest(BaseModel):
    message: str


@app.post("/api/chat/")
async def chatapi(req: ChatRequest):
    reply: str = await use_ai(req.message)
    return {"reply": reply}


@app.post("/api/chats/")
async def create_chat(db: AsyncSession = Depends(get_db)):
    chat: Chat = Chat()
    db.add(chat)
    await db.commit()
    await db.refresh(chat)
    return chat


@app.get("/api/chats/")
async def list_chats(db: AsyncSession = Depends(get_db)):
    res: Result[Any] = await db.execute(select(Chat).order_by(Chat.id))
    return res.scalars().all()


@app.get("/api/chats/{chat_id}/")
async def get_chat(chat_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Message)
        .where(Message.chat_id == chat_id)
        .order_by(Message.created_at)
    )
    return res.scalars().all()


@app.post("/api/chats/{chat_id}/message/")
async def send_message(chat_id: int, req: ChatRequest, db: AsyncSession = Depends(get_db)):
    user_msg = Message(
        chat_id=chat_id,
        role="user",
        content=req.message,
    )
    db.add(user_msg)
    await db.flush()

    res = await db.execute(
        select(Message)
        .where(Message.chat_id == chat_id)
        .order_by(Message.created_at)
    )
    history = res.scalars().all()

    ai_reply: str = await use_ai("\n".join(f"{m.role}: {m.content}" for m in history))

    ai_msg = Message(
        chat_id=chat_id,
        role="assistant",
        content=ai_reply
    )
    db.add(ai_msg)

    await db.commit()
    return {"reply": ai_reply}


@app.get("/api/health/")
async def health():
    return {"status": "ok"}


async def use_ai(prompt: str) -> str:
    loop: AbstractEventLoop = asyncio.get_running_loop()
    res: genai.types.GenerateContentResponse = await loop.run_in_executor(
        None,
        lambda: client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt],
        )
    )
    return str(res.text)


logger.info("Perfect!")

if __name__ == "__main__":
    uvicorn.run(app)
