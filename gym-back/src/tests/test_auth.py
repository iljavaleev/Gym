from app.models.database import Base, User
from app.routers.auth import get_password_hash

def test_login(client, session):
    password = "123"
    ul = [
        User(email="user@user.com", 
             hashed_password=get_password_hash(password)),
    ]
    session.add_all(ul)
    session.commit()
    
    response = client.post("/api/v1/login", data={
        "username":"user@user.com", "password":password})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    assert len([response.json()["access_token"]])


def test_register(client):
    response = client.post("/api/v1/register", data={
        "username":"test@mail.com", "password":"123"})
    assert response.status_code == 201
    assert response.json()["token_type"] == "bearer"
    assert len(response.json()["access_token"])
