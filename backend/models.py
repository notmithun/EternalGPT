import uuid
from datetime import datetime, UTC
from typing import Any, List

from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import declarative_base, relationship, Mapped, mapped_column

Base: type[declarative_base()] = declarative_base()


class Chat(Base):
    __tablename__: str = "chats"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), default="New Chat")

    messages: Mapped[List["Message"]] = relationship(
        back_populates="chat",
        cascade="all, delete-orphan"
    )


class Message(Base):
    __tablename__: str = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id"))
    role: Mapped[str] = mapped_column(String(50))
    content: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    chat: Mapped["Chat"] = relationship(back_populates="messages")
