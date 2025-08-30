from fastapi import Depends, status, APIRouter
from datetime import datetime, timedelta, timezone
from typing import Annotated
from email_validator import (
    EmailNotValidError,
    validate_email,
)
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from psycopg2 import IntegrityError
from models.models import UserInDB, Token
from models.database import User
from sqlalchemy.orm import Session
import logging
from db_connection import get_session
import os


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()

logger = logging.getLogger('uvicorn.error')


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def add_user(email: str, password: str,  session: Session) -> User | None:
    hashed_password = pwd_context.hash(password)
    db_user = User(email=email, hashed_password=hashed_password)
    session.add(db_user)
    try:
        session.commit()
        session.refresh(db_user)
    except IntegrityError:
        session.rollback()
        raise
    return db_user


async def get_user(email: str, session: Session) -> UserInDB | None:
    try:
        validate_email(email)
    except EmailNotValidError:
        return
    return session.query(User).filter(User.email == email).first()

    
async def authenticate_user(email: str, password: str, session) -> UserInDB:
    user: UserInDB = await get_user(email, session)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, 
                        expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/api/v1/login", status_code=status.HTTP_200_OK)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
                session: Annotated[Session, Depends(get_session)]):
    
    user: UserInDB = await authenticate_user(form_data.username, 
                                             form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}, 
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/api/v1/register", status_code=status.HTTP_201_CREATED)
async def register(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
                   session: Annotated[Session, Depends(get_session)]):
    try:
        user: UserInDB = await get_user(form_data.username, session)
    except Exception as e:
        logger.error(e)    
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User with this email already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user: UserInDB = None
    try:
        user = await add_user(email=form_data.username, 
                              password=form_data.password, session=session)
    except IntegrityError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We have some problems. Try later",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}, 
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
