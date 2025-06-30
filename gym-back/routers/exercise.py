from psycopg2 import IntegrityError
from models.database import Exercise
from models.models import UserExersise, UserInDB
from db_connection import get_session
from sqlalchemy.orm import Session
from fastapi import Depends, status, APIRouter
from dependencies import get_current_user
from typing import Annotated
from sqlalchemy import delete

import logging

router = APIRouter()

logger = logging.getLogger('uvicorn.error')

# http://localhost:8000/api/v1/user-exercise

@router.get("/api/v1/user-exercise", status_code=status.HTTP_200_OK)
def get_all_exercise(user: Annotated[UserInDB, Depends(get_current_user)], 
    session: Session = Depends(get_session)) -> list[UserExersise]:
    try:
        exersices: list[Exercise] = session.query(Exercise).filter(
            Exercise.user_id == user.id)
    except Exception as e:
        logger.error(e)
    return [ex.exercise for ex in exersices]


@router.post("/api/v1/user-exercise", status_code=status.HTTP_201_CREATED)
def create_exercise(ex: UserExersise, user: Annotated[UserInDB, Depends(get_current_user)], 
    session: Session = Depends(get_session)):
    try:
        ex = Exercise(exercise=ex.exercise, user=user.id)
        session.add(ex)
        session.commit()
        session.refresh(ex)
    except IntegrityError:
        session.rollback()
        raise
    except Exception as e:
        logger.error(e)

# http://localhost:8000/api/v1/user-exercise?ex=${id}

@router.delete("/api/v1/user-exercise", status_code=status.HTTP_200_OK)
def delete_exercise(id: int, user: Annotated[UserInDB, Depends(get_current_user)], 
    session: Session = Depends(get_session)):
    try:
        session.query(Exercise).filter(Exercise.id == id).delete()
    except Exception as e:
        logger.error(e)