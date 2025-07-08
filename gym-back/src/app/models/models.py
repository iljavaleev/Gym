import datetime
from typing import Annotated
from pydantic import BaseModel


class EnduranceTrainingResp(BaseModel):
    exercise: str
    reps: str | None
    superset: int | None


class StrenghtTrainigResp(BaseModel):
    exercise: str
    reps: str | None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    id: int
    email: str    

class UserInDB(User):
    hashed_password: str


class UserExercise(BaseModel):
    id: int | None = None 
    exercise: str


class UserLoad(BaseModel):
    reps: int
    expect: int | None
    fact: int | None


class UserWorkout(BaseModel):
    exercise: UserExercise
    load: list[UserLoad]


class UserTraining(BaseModel):
    date: datetime.datetime
    training: list[UserWorkout]
