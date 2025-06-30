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


class UserExersise(BaseModel):
    exercise: str