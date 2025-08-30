from typing import Annotated
from models.database import Strength, Endurance
from models.models import EnduranceTrainingResp, StrenghtTrainigResp
from db_connection import get_session
from sqlalchemy.orm import Session
from fastapi import Depends, status, APIRouter

import logging

router = APIRouter()

logger = logging.getLogger('uvicorn.error')

@router.get("/api/v1/search", status_code=status.HTTP_200_OK)
def get_training(book:int, number: int, 
                 session: Annotated[Session, Depends(get_session)]
    ) -> list[EnduranceTrainingResp|StrenghtTrainigResp]:
    res_list = []
    if (book):
        res_list = (
            session.query(Endurance).filter(Endurance.work_id == number))

        return [EnduranceTrainingResp(
            exercise=e.exercise, 
            reps=e.reps, 
            superset=e.superset) for e in res_list]
    
    res_list = (session.query(Strength).filter(Strength.work_id == number))
    return [StrenghtTrainigResp(exercise=e.exercise, 
                                reps=e.reps) for e in res_list]
