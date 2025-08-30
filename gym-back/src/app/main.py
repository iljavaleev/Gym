from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import generic, auth, exercise, training
from db_connection import get_engine
from models.database import Base
import pandas as pd
import logging
import os

logger = logging.getLogger('uvicorn.error')


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=get_engine())
    engine = get_engine()
    try:
        df = pd.read_csv(os.getenv("ENDURANCE_FILE_PATH"))
        df.to_sql('endurance', engine, if_exists='replace', index=False)

        df = pd.read_csv(os.getenv('STRENGTH_FILE_PATH'))
        df.to_sql('strength', engine, if_exists='replace', index=False)
    except FileNotFoundError:
        pass
    
    yield

origins = [os.getenv("FRONT_URL")]


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
app.include_router(training.router)
