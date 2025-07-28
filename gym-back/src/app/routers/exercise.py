from sqlalchemy import delete
from app.models.database import Exercise
from app.models.models import UserExercise, UserInDB
from app.db_connection import get_session
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, Query, status, APIRouter
from app.dependencies import get_current_user
from typing import Annotated, List, Optional

import logging

router = APIRouter()

logger = logging.getLogger('uvicorn.error')


@router.get("/api/v1/user-exercise", 
            status_code=status.HTTP_200_OK, 
            response_model=List[UserExercise], 
            response_model_exclude_unset=True)
async def get_all_exercise(user: Annotated[UserInDB, Depends(get_current_user)], 
    session: Annotated[Session, Depends(get_session)]):
    exersices: list[Exercise] = None
    try:
        exersices = session.query(Exercise).filter(Exercise.user_id == user.id)
    except Exception as e:
        logger.error(e)
    if exersices is None:
        return []
    return [UserExercise(id=ex.id, title=ex.title) for ex in exersices]


@router.post("/api/v1/user-exercise", 
             status_code=status.HTTP_201_CREATED, 
             response_model=UserExercise)
async def create_exercise(ex: UserExercise, 
                          user: Annotated[UserInDB, Depends(get_current_user)], 
    session: Annotated[Session, Depends(get_session)]):
    try:
        dbex = Exercise(title=ex.title, user_id=user.id)
        session.add(instance=dbex)
        session.commit()
        session.refresh(dbex)
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="DB error")
    
    return dbex

# http://localhost:8000/api/v1/user-exercise?ex=${id}


@router.delete("/api/v1/user-exercise", status_code=status.HTTP_200_OK)
async def delete_exercise(id: Annotated[int, Query()], 
                          user: Annotated[UserInDB, Depends(get_current_user)], 
    session: Annotated[Session, Depends(get_session)]):
    try:
        stmnt = (
            delete(Exercise)      
            .where(Exercise.id == id, Exercise.user_id == user.id)
        )
        deleted = session.execute(stmnt)
        session.commit()
        if not deleted:
            raise Exception()
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid id",
            headers={"WWW-Authenticate": "Bearer"},
        )
