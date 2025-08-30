import datetime
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
    title: str | None = None


class UserLoad(BaseModel):
    reps: int
    expect: int | None
    fact: int | None


class UserWorkout(BaseModel):
    count: int | None = None
    exercise: UserExercise | None
    load: list[UserLoad]


class UserTraining(BaseModel):
    date: datetime.datetime
    training: list[UserWorkout]
