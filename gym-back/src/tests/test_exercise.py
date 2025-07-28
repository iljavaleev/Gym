def test_post_exercise(client, token):
    response = client.post("/api/v1/user-exercise", 
                           json={ "title": "test exercise" }, 
                           headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.json()["title"] == "test exercise"


def test_get_exercise(client, token):
    client.post("/api/v1/user-exercise", json={ "title": "test exercise 1" }, 
        headers={"Authorization": f"Bearer {token}"})
    client.post("/api/v1/user-exercise", json={ "title": "test exercise 2" }, 
        headers={"Authorization": f"Bearer {token}"})
    
    response = client.get("/api/v1/user-exercise", 
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == [{'id': 1, 'title': 'test exercise 1'}, 
                               {'id': 2, 'title': 'test exercise 2'}]
    
    
def test_delete_exercise(client, token):
    client.post("/api/v1/user-exercise", json={ "title": "test exercise 1" }, 
        headers={"Authorization": f"Bearer {token}"})
    client.post("/api/v1/user-exercise", json={ "title": "test exercise 2" }, 
        headers={"Authorization": f"Bearer {token}"})
    
    response = client.delete("/api/v1/user-exercise?id=1", 
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    response = client.get("/api/v1/user-exercise", 
                          headers={"Authorization": f"Bearer {token}"})
    assert response.json() == [{'id': 2, 'title': 'test exercise 2'}]
    