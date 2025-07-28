from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

PSQL_DATABASE_URL = "postgresql+psycopg2://postgres@localhost:5432/gymdb"


@lru_cache
def get_engine():
      return create_engine(PSQL_DATABASE_URL)

def get_session():
      session_maker: Session = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
      try:
         session = session_maker()
         return session
      finally:
         session.close()