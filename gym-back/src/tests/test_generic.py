from app.models.database import Base, User, Strength, Endurance

import logging

logger = logging.getLogger('uvicorn.error')

def test_get_training(client, session):
    sl = [
        Strength(exercise="сед", reps=6, work_id=1, week_id=1),
        Strength(exercise="квадрицепс тренажер", reps=8, work_id=1, week_id=1)
    ]
    el = [
        Endurance(exercise="сед тренажер", reps=15,  work_id=1, week_id=1),
        Endurance(exercise="квадрицепс тренажер", reps=12, work_id=1, week_id=1)
    ]
    session.add_all(sl)
    session.add_all(el)
    session.commit()

    response = client.get("api/v1/search?book=0&number=1")
    assert response.status_code == 200
    assert response.json() == [
        {"exercise": "сед", "reps": '6'},  
        {'exercise': 'квадрицепс тренажер', 'reps': '8'}
    ]

    response = client.get("api/v1/search?book=1&number=1")
    assert response.status_code == 200
    assert response.json() == [
        {'exercise': 'сед тренажер', 'reps': '15', 'superset': None},  
        {'exercise': 'квадрицепс тренажер', 'reps': '12', 'superset': None}
    ]

