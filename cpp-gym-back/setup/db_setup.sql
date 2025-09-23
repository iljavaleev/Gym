DROP TABLE IF EXISTS endurance CASCADE;
DROP TABLE IF EXISTS strength CASCADE;
DROP TABLE IF EXISTS gym_user CASCADE;
DROP TABLE IF EXISTS user_exercise CASCADE;
DROP TABLE IF EXISTS workout CASCADE;
DROP TABLE IF EXISTS load CASCADE;

CREATE TABLE endurance(
    id SERIAL PRIMARY KEY,
    exercise TEXT,
    reps varchar(32),
    superset int,
    work_id int NOT NULL,
    week_id int NOT NULL
);

CREATE TABLE strength(
    id SERIAL PRIMARY KEY,
    exercise TEXT,
    reps varchar(32),
    work_id int NOT NULL,
    week_id int NOT NULL
);

CREATE TABLE gym_user(
    id SERIAL PRIMARY KEY,
    email varchar(128) NOT NULL,
    hashed_password TEXT NOT NULL,
    UNIQUE (email), 
    UNIQUE (id)
);

CREATE TABLE user_exercise(
    id SERIAL PRIMARY KEY,
    user_id int references gym_user(id),
    title TEXT NOT NULL,
    UNIQUE (id),
    UNIQUE (user_id, title)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE workout(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    count int NOT NULL,
    user_id int references gym_user(id) ON DELETE CASCADE,
    exercise int references user_exercise(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    UNIQUE (date, user_id, exercise), 
    UNIQUE (count, date)
);

CREATE TABLE load(
    id SERIAL PRIMARY KEY,
    workout UUID references workout(id) ON DELETE CASCADE,
    reps int NOT NULL,
    expect int,
    fact int,
    CHECK (expect > 0 AND reps < 100),
    CHECK (expect is NULL OR (expect >= 0 and expect < 500)),
    CHECK (fact is NULL OR (fact >= 0 and fact < 500))
);
