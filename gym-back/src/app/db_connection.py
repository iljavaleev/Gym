from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os


PSQL_DATABASE_URL = f"""postgresql+psycopg2://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}"""


@lru_cache
def get_engine():
      return create_engine(PSQL_DATABASE_URL)

def get_session():
      session_maker: Session = sessionmaker(autocommit=False, autoflush=False, 
                                            bind=get_engine())
      try:
         session = session_maker()
         yield session
      finally:
         session.close()
         