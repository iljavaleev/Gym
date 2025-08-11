TEST_DATE = "2023-10-27T10:30:00Z"

TRAINING = {
        "date": TEST_DATE, 
        "training": [{
            "count": 1,
            "exercise": {"id": 1},
            "load":[
                { "reps": 1, "expect": 10, "fact": 100 },
                { "reps": 1, "expect": 10, "fact": 100 },
                { "reps": 1, "expect": 10, "fact": 100 }
            ]
        },{
            "count": 2,
            "exercise": {"id": 2},
            "load":[
                { "reps": 2, "expect": 10, "fact": 100 },
                { "reps": 2, "expect": 10, "fact": 100 },
                { "reps": 2, "expect": 10, "fact": 100 }
            ]
        }]
}

def test_post_training(client, token):
    client.post("/api/v1/user-exercise", json={ "title": "test 1" }, 
                headers={"Authorization": f"Bearer {token}"})
    client.post("/api/v1/user-exercise", json={ "title": "test 2" }, 
                headers={"Authorization": f"Bearer {token}"})
    

    response = client.post("/api/v1/user-training", 
                           json=TRAINING, 
                           headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.json() == TRAINING


def test_get_training(client, token):
    client.post("/api/v1/user-training", json=TRAINING, 
                headers={"Authorization": f"Bearer {token}"})
    
    response = client.get(f"/api/v1/user-training?date={TEST_DATE}", 
        headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 200
    
    
def test_delete_trainig(client, token):
    client.post("/api/v1/user-training", json=TRAINING, 
                headers={"Authorization": f"Bearer {token}"})
    
    response = client.delete(f"/api/v1/user-training?date={TEST_DATE}", 
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200