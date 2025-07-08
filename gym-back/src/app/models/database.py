import datetime
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column
)
from sqlalchemy import DateTime, UniqueConstraint, ForeignKey
from sqlalchemy import CheckConstraint

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
    
# many to many user - exercise
class Workout(Base):
    __tablename__ = "workout"
    __table_args__ = (
        UniqueConstraint("user_id", "exercise", name="unique_workout_ex")
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("gym_user.id"), ondelete="CASCADE"
    )
    exercise: Mapped[int] = mapped_column(ForeignKey("user_exercise.id"))
    date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), 
                                                    nullable=False)
    
class Load(Base):
    __tablename__ = "load"
    id: Mapped[int] = mapped_column(primary_key=True)
    workout: Mapped[int] = mapped_column(
        ForeignKey("workout.id"), ondelete="CASCADE"
    )
    reps: Mapped[int] = mapped_column(nullable=False)
    expect: Mapped[int] = mapped_column(nullable=True)
    fact: Mapped[int] = mapped_column(nullable=True)
    CheckConstraint("reps > 0 and reps < 100", name="check1")
    CheckConstraint("expect is None or (expect >= 0 and expect < 500)", 
                    name="check2")
    CheckConstraint("expect is None or (expect >= 0 and expect < 500)", 
                    name="check3")


# from sqlalchemy import select, create_engine
# from sqlalchemy.orm import Session, sessionmaker

# PSQL_DATABASE_URL = "postgresql+psycopg2://postgres@localhost:5432/postgres"

# def get_engine():
#       return create_engine(PSQL_DATABASE_URL)


# def get_session():
#       session_maker: Session = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
#       try:
#          session = session_maker()
#          return session
#       finally:
#          session.close()


# if __name__ == "__main__":
#     stmnt = (
#         select(Exercise.exercise, Load.reps, Load.expect, Load.fact)      
#         .where(Workout.date == '01-01-2002 10:30:00')
#         .select_from(Workout)
#         .join(Load, Load.workout == Workout.id)
#         .join(Exercise, Exercise.id == Workout.exercise)      
#         .order_by(Workout.id, Load.id)
#     )

#     session: Session = get_session()
#     res = session.execute(statement=stmnt)
#     for exercise, reps, expect, fact in res:
#         print(exercise, reps, expect, fact)
