from psycopg2 import IntegrityError
from models.database import Exercise, Load, Workout
from models.models import UserTraining, UserInDB, UserLoad, UserWorkout, UserExercise
from db_connection import get_session
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, APIRouter
from dependencies import get_current_user
from typing import Annotated, Optional
from datetime import datetime
from sqlalchemy import select, delete, insert

import logging

router = APIRouter()

logger = logging.getLogger('uvicorn.error')

# https://example.com/users/12345/bids?start=2022-08-08T00:00:00.000Z&end=2022-08-09T00:00:00.000Z

@router.get("/api/v1/user-training", status_code=status.HTTP_200_OK)
def get_training(date: datetime, user: Annotated[UserInDB, Depends(get_current_user)], 
    session: Annotated[Session, Depends(get_session)]) -> UserTraining | None:
    
    stmnt = (
        select(Exercise.id, Exercise.exercise, Load.reps, Load.expect, Load.fact)      
        .where((Workout.date == date) & (Workout.user_id == user.id))
        .select_from(Workout)
        .join(Load, Load.workout == Workout.id)
        .join(Exercise, Exercise.id == Workout.exercise)      
        .order_by(Workout.id, Load.id)
    )
    res = None
    try:
        res = session.execute(statement=stmnt)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=502, detail="Database error")
    

    training: UserTraining = UserTraining(date=date, training=[])
    prev: int = None
    wk: UserWorkout = None
    start = True
    for ex_id, exercise, reps, expect, fact in res:
        if ex_id != prev:
            if not start:
                training.training.append(wk)
            start = False
            wk.load = []
            wk.exercise = UserExercise(id=ex_id, exercise=exercise)
        wk.load.append(UserLoad(reps, expect, fact))
        prev = ex_id
    
    return training



@router.post("/api/v1/user-training", 
             response_model=Optional[UserTraining], 
             status_code=status.HTTP_201_CREATED)
def create_training(training: UserTraining, 
                    user: Annotated[UserInDB, Depends(get_current_user)], 
                    session: Annotated[Session, Depends(get_session)]):
    
    stmnt = (
        delete(Workout)      
        .where(Workout.date == training.date, Workout.user_id == user.id)
    )

    try:
        session.execute(statement=stmnt)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=502, detail="Database error")
    
# id:
# user_id:
# exercise: int
# date:

# workout:
# reps: 
# expect:
# fact:
    

    workouts: list[UserWorkout] = []
    loads: list[Load] = []
    for workout in training.training:
        id=hash(user.id, training.date, workout.exercise.id)
        workouts.append(
            Workout(id=id,
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
        session.execute(insert(Workout), workouts)
        session.execute(insert(Load), loads)
        session.commit()
    except Exception as e:
        logger.error(e)
        session.rollback()
        raise HTTPException(status_code=502, detail="Database error")
    
    return training


@router.delete("/api/v1/user-training", status_code=status.HTTP_200_OK)
def delete_training(date: datetime, 
                    user: Annotated[UserInDB, Depends(get_current_user)], 
                    session: Annotated[Session, Depends(get_session)]):
    
    stmnt = (
        delete(Workout)      
        .where(Workout.date == date, Workout.user_id == user.id)
    )

    try:
        deleted = session.execute(statement=stmnt)
        if not deleted:
            raise Exception("Wrong date")
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date"
        )
