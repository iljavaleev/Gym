import pytest
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from app.main import app
from app.models.database import Base, User, Strength, Endurance
from app.db_connection import get_session
import logging

logger = logging.getLogger('uvicorn.error')


@pytest.fixture(name="session")  
def session_fixture():  
    engine = create_engine("sqlite://", 
                           connect_args={"check_same_thread": False}, 
                           poolclass=StaticPool)
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    yield session  


@pytest.fixture(name="client")  
def client_fixture(session):  
    def get_session_override():  
        return session
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client  
    app.dependency_overrides.clear() 
    
    
@pytest.fixture(name="token")  
def token_fixture(client):  
    response = client.post("/api/v1/register", data={
        "username":"exuser@user.com", "password":"1234"})
    
    token = response.json()["access_token"]
    yield token  