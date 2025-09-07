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
    '''
    query_base = f"psql -h {os.getenv("DB_HOST")}\
        -U {os.getenv("DB_USER")} \
            -d {os.getenv("DB_NAME")}"
   
    def sql_query(table, file_path):
        drop_query = f"DELETE FROM {table};"
        copy_query = f"\\COPY {table} FROM '{file_path}' DELIMITER '|' CSV HEADER"
        idx_query = f"SELECT setval('{table}_id_seq', max(id)) FROM {table};"

        return f"{query_base} -c '{drop_query}'", \
            f'{query_base} -c "{copy_query}";', \
            f'{query_base} -c "{idx_query}";'
    try:

        table = "endurance"
        file_path = os.getenv("ENDURANCE_FILE_PATH")
        for q in sql_query(table, file_path):
            os.system(q)
       
        table = "strength"
        file_path = os.getenv("STRENGTH_FILE_PATH")
        for q in sql_query(table, file_path):
            os.system(q)
        
        table = "user_exercise"
        file_path = os.getenv("EXS_FILE_PATH")
        for q in sql_query(table, file_path):
            os.system(q)
        
    except FileNotFoundError:
        pass
    '''
    yield

origins = [os.getenv("FRONT_URL")]


app = FastAPI(title="Saas application", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generic.router)
app.include_router(auth.router)
app.include_router(exercise.router)
app.include_router(training.router)
