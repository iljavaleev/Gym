import datetime
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column
)
from sqlalchemy import DateTime, Integer, UniqueConstraint, ForeignKey
from sqlalchemy import CheckConstraint
from uuid import uuid4, UUID

class Base(DeclarativeBase):
    pass


class Endurance(Base):
    __tablename__ = "endurance"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    exercise: Mapped[str]
    reps: Mapped[str] = mapped_column(nullable=True)
    superset: Mapped[int|None]
    work_id: Mapped[int] = mapped_column(nullable=False)
    week_id: Mapped[int] = mapped_column(nullable=False)


class Strength(Base):
    __tablename__ = "strength"
    id: Mapped[int] = mapped_column(primary_key=True)
    exercise: Mapped[str]
    reps: Mapped[str] = mapped_column(nullable=True)
    work_id: Mapped[int] = mapped_column(nullable=False)
    week_id: Mapped[int] = mapped_column(nullable=False)


class User(Base):
    __tablename__ = "gym_user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str]
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    __table_args__ = (UniqueConstraint("email", name="unique_email"),)


class Exercise(Base):
    __tablename__ = "user_exercise"
    __table_args__ = (
        UniqueConstraint("user_id", "title", name="unique_user_ex"),
    )
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("gym_user.id"), nullable=True)
    title: Mapped[str]
    

class Workout(Base):
    __tablename__ = "workout"
    __table_args__ = (
        UniqueConstraint("date", "user_id", "exercise", 
                         name="unique_workout_ex"),
        UniqueConstraint("count", "date", name="unique_count_ex"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    count:  Mapped[int] = mapped_column(nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, 
        ForeignKey("gym_user.id", ondelete="CASCADE")
    )
    exercise: Mapped[int] = mapped_column(
        ForeignKey("user_exercise.id", ondelete="SET NULL"), nullable=True)
    date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=False), 
                                                    nullable=False)
    
class Load(Base):
    __tablename__ = "load"
    id: Mapped[int] = mapped_column(primary_key=True)
    workout: Mapped[UUID] = mapped_column(
        ForeignKey("workout.id", ondelete="CASCADE")
    )
    reps: Mapped[int] = mapped_column(nullable=False)
    expect: Mapped[int] = mapped_column(nullable=True)
    fact: Mapped[int] = mapped_column(nullable=True)
    CheckConstraint("reps > 0 and reps < 100", name="check1")
    CheckConstraint("expect is None or (expect >= 0 and expect < 500)", 
                    name="check2")
    CheckConstraint("fact is None or (fact >= 0 and fact < 500)", 
                    name="check3")
