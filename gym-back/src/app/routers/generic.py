from typing import Annotated
from models.database import Strength, Endurance
from models.models import EnduranceTrainingResp, StrenghtTrainigResp
from db_connection import get_session
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy import ChunkedIteratorResult, select

import logging

router = APIRouter()

logger = logging.getLogger('uvicorn.error')

@router.get("/api/v1/search", status_code=status.HTTP_200_OK)
def get_training(book:int, number: int, 
                 session: Annotated[Session, Depends(get_session)]
    ) -> list[EnduranceTrainingResp|StrenghtTrainigResp]:
    
    if book:
        stmnt = (
            select(Endurance.exercise, Endurance.reps, Endurance.superset)      
            .where(Endurance.work_id == number)
            .select_from(Endurance)
        )
    else:
        stmnt = (
            select(Strength.exercise, Strength.reps)      
            .where(Strength.work_id == number)
            .select_from(Strength)
        )
    try:
        res: ChunkedIteratorResult = list(session.execute(statement=stmnt))
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=502, detail="Database error")

    if book:
        return [EnduranceTrainingResp(exercise=e.exercise, reps=e.reps, 
                                      superset=e.superset) for e in res]
    
    return [StrenghtTrainigResp(exercise=e.exercise, reps=e.reps) for e in res]
