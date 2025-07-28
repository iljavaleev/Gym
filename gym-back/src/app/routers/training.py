from psycopg2 import IntegrityError
from app.models.database import Exercise, Load, Workout
from app.models.models import UserTraining, UserInDB, UserLoad, UserWorkout, UserExercise
from app.db_connection import get_session
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, APIRouter
from app.dependencies import get_current_user
from typing import Annotated, Optional
from datetime import datetime
from sqlalchemy import select, delete, ChunkedIteratorResult
from fastapi import Query
import uuid
from datetime import datetime

import logging

router = APIRouter()

logger = logging.getLogger("uvicorn.error")

# change 
def get_query(stmnt, session, req_date=None) -> UserTraining | None:
    res = None
    try:
        res: ChunkedIteratorResult = list(session.execute(statement=stmnt))
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=502, detail="Database error")
    
    if not res:
        return UserTraining(date=datetime.now(), training=[])
    
    res_dict: dict = {} 
    training = []

    for date, count, ex_id, title, reps, expect, fact in res:
       (res_dict
        .setdefault((count, ex_id, title), [])
        .append(UserLoad(reps=reps, expect=expect, fact=fact)))

    for k, v in res_dict.items():
        training.append(UserWorkout(
            count=k[0],
            exercise=UserExercise(id=k[1], title=k[2]), 
            load=v))
        
    logger.error(date)
    user_traning = UserTraining(date=req_date if req_date else date, training=training)

    del res_dict
    return user_traning


@router.get("/api/v1/user-training", status_code=status.HTTP_200_OK)
def get_training(date: Annotated[datetime, Query()], 
                user: Annotated[UserInDB, Depends(get_current_user)], 
                session: Annotated[Session, Depends(get_session)]
) -> UserTraining | None:    
    stmnt = (
        select(Workout.date, Workout.count, Exercise.id, Exercise.title, 
               Load.reps, Load.expect, Load.fact)      
        .where((Workout.date == date) & (Workout.user_id == user.id))
        .select_from(Workout)
        .join(Load, Load.workout == Workout.id)
        .join(Exercise, Exercise.id == Workout.exercise)      
        .order_by(Workout.count, Load.id)
    )
    
    return get_query(stmnt, session, req_date=date)


@router.get("/api/v1/user-next-training", status_code=status.HTTP_200_OK)
def get_next_training(date: int, 
                user: Annotated[UserInDB, Depends(get_current_user)], 
                session: Annotated[Session, Depends(get_session)]
) -> UserTraining | None:    
    date = datetime.fromtimestamp(date/1000)
    subq = (
        select(Workout.date.label("date"))
        .where((Workout.date >= date) & (Workout.user_id == user.id))
        .limit(1).scalar_subquery()
    )
    stmnt = (
        select(Workout.date, Workout.count, Exercise.id, Exercise.title, 
               Load.reps, Load.expect, Load.fact)      
        .where((Workout.date == subq) & (Workout.user_id == user.id))
        .select_from(Workout)
        .join(Load, Load.workout == Workout.id)
        .join(Exercise, Exercise.id == Workout.exercise)      
        .order_by(Workout.count, Load.id)
    )
    
    return get_query(stmnt, session)


@router.post("/api/v1/user-training", 
             response_model=Optional[UserTraining], 
             status_code=status.HTTP_201_CREATED, 
             response_model_exclude_unset=True)
def create_training(training: UserTraining, 
                    user: Annotated[UserInDB, Depends(get_current_user)], 
                    session: Annotated[Session, Depends(get_session)]):
    
    stmnt = (
        delete(Workout)      
        .where(Workout.date == training.date, Workout.user_id == user.id)
    )

    try:
        session.execute(statement=stmnt)
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(e)
        raise HTTPException(status_code=502, detail="Database error")
    
    workouts: list[UserWorkout] = []
    loads: list[Load] = []
    for workout in training.training:
        id=uuid.uuid4()
        workouts.append(
            Workout(id=id,
                    count=workout.count,
                    exercise=workout.exercise.id, 
                    user_id=user.id, 
                    date=training.date))
        for load in workout.load:
            loads.append(
                Load(workout=id, 
                     reps=load.reps, 
                     expect=load.expect, 
                     fact=load.fact))
        
    try:
        session.add_all(workouts)
        session.commit()
        session.add_all(loads)
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(status_code=502, detail="Database error")
    
    return training


@router.delete("/api/v1/user-training", status_code=status.HTTP_200_OK)
def delete_training(date: Annotated[datetime, Query()], 
                    user: Annotated[UserInDB, Depends(get_current_user)], 
                    session: Annotated[Session, Depends(get_session)]):
    
    stmnt = (
        delete(Workout)      
        .where(Workout.date == date, Workout.user_id == user.id)
    )

    try:
        deleted = session.execute(statement=stmnt)
        if not deleted.rowcount:
            raise Exception("Wrong date")
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date"
        )
