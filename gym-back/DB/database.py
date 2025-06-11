from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column
)

class Base(DeclarativeBase):
    pass

# add field
class Endurance(Base):
    __tablename__ = "endurance"
    id: Mapped[int] = mapped_column(primary_key=True)
    exercise: Mapped[str]
    reps: Mapped[str]
    superset: Mapped[int]
    work_id: Mapped[int] = mapped_column(nullable=False)
    week_id: Mapped[int] = mapped_column(nullable=False)

class Strength(Base):
    __tablename__ = "strenght"
    id: Mapped[int] = mapped_column(primary_key=True)
    exercise: Mapped[str]
    reps: Mapped[str]
    work_id: Mapped[int] = mapped_column(nullable=False)
    week_id: Mapped[int] = mapped_column(nullable=False)