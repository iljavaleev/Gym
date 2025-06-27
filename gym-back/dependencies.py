from fastapi import Depends, status
from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status
from jwt.exceptions import InvalidTokenError
from models.models import  TokenData
from routers.auth import oauth2_scheme, get_user

SECRET_KEY = "ce5992eeaf88d3ee4066e9bd0fb075905b8c248db9114872eb856bf7e29fb42a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload: dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user