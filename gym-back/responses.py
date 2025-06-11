from typing import Annotated
from pydantic import BaseModel


class EnduranceTraining(BaseModel):
    exercise: str
    reps: str | None
    superset: int | None


class StrenghtTrainig(BaseModel):
    exercise: str
    reps: str | None
