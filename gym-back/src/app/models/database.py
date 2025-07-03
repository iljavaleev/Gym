from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column
)
from sqlalchemy import UniqueConstraint, ForeignKey

class Base(DeclarativeBase):
    pass


class Endurance(Base):
    __tablename__ = "endurance"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    exercise: Mapped[str]
    reps: Mapped[str]
    superset: Mapped[int|None]
    work_id: Mapped[int] = mapped_column(nullable=False)
    week_id: Mapped[int] = mapped_column(nullable=False)


class Strength(Base):
    __tablename__ = "strenght"
    id: Mapped[int] = mapped_column(primary_key=True)
    exercise: Mapped[str]
    reps: Mapped[str]
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
    __table_args__ = (UniqueConstraint("user_id", "exercise", name="unique_user_ex"),)
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("gym_user.id"))
    exercise: Mapped[str]
    
    