from contextlib import (
    asynccontextmanager
)
from DB.db_connection import get_engine, get_session
from DB.database import Base, Endurance, Strength
from responses import EnduranceTraining, StrenghtTrainig

from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, FastAPI
import logging
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger('uvicorn.error')

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=get_engine())
    yield

origins = ["http://localhost:5173"]

app = FastAPI(title="Saas application", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get(
    "/api/v1/search",
    status_code=status.HTTP_200_OK,
)
def register(
    book:int,
    number: int,
    session: Session = Depends(get_session),
) -> list[EnduranceTraining|StrenghtTrainig]:
    res_list = []
    if (book):
        res_list = (session.query(Endurance)
        .filter(Endurance.work_id == number))

        return [EnduranceTraining(
            exercise=e.exercise, 
            reps=e.reps, 
            superset=e.superset) for e in res_list]

    res_list = (session.query(Strength)
    .filter(Strength.work_id == number))

    return [StrenghtTrainig(
            exercise=e.exercise, 
            reps=e.reps) for e in res_list]
