from contextlib import asynccontextmanager
from fastapi import Depends, HTTPException, status, FastAPI
from sqlmodel import SQLModel
from fastapi.middleware.cors import CORSMiddleware
from app.routers import generic, auth, exercise
from app.db_connection import get_engine
from app.models.database import Base

import logging

logger = logging.getLogger('uvicorn.error')


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=get_engine())
    yield

origins = ["http://localhost:5173/"]


app = FastAPI(title="Saas application", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generic.router)
app.include_router(auth.router)
app.include_router(exercise.router)
