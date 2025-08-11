-- DELETE FROM user_exercise;
-- DELETE FROM workout;
-- DELETE FROM load;
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- INSERT INTO user_exercise VALUES (1, 1, 'сед');
-- INSERT INTO user_exercise VALUES (2, 1, 'бицепс');
-- INSERT INTO user_exercise VALUES (3, 1, 'квадрицепс');
-- INSERT INTO user_exercise VALUES (4, 1, 'трицепс');

-- INSERT INTO workout VALUES (uuid_generate_v4(), 1, 1, 1, '01-01-2002 10:30:00');
-- INSERT INTO workout VALUES (uuid_generate_v4(), 2, 1, 2, '01-01-2002 10:30:00');
-- INSERT INTO workout VALUES (uuid_generate_v4(), 3, 1, 3, '01-01-2002 10:30:00');
-- INSERT INTO workout VALUES (uuid_generate_v4(), 4, 1, 4, '01-01-2002 10:30:00');
-- INSERT INTO workout VALUES (uuid_generate_v4(), 1, 1, 1, '02-01-2002 10:30:00');
-- INSERT INTO workout VALUES (uuid_generate_v4(), 2, 1, 2, '02-01-2002 10:30:00');
-- INSERT INTO workout VALUES (uuid_generate_v4(), 3, 1, 3, '03-01-2002 10:30:00');
-- INSERT INTO workout VALUES (uuid_generate_v4(), 4, 1, 4, '04-01-2002 10:30:00');

-- INSERT INTO load VALUES (1, '9d57bd84-9c9c-460e-80e5-7fa5f367cc03', 8, 100, default);
-- INSERT INTO load VALUES (2, '9d57bd84-9c9c-460e-80e5-7fa5f367cc03', 9, 100, default);
-- INSERT INTO load VALUES (3, '9d57bd84-9c9c-460e-80e5-7fa5f367cc03', 10, 100, default);

-- INSERT INTO load VALUES (4, '594a96bf-781d-427f-a59f-14ae42689f74', 18, 80, default);
-- INSERT INTO load VALUES (5, '594a96bf-781d-427f-a59f-14ae42689f74', 19, 80, default);
-- INSERT INTO load VALUES (6, '594a96bf-781d-427f-a59f-14ae42689f74', 20, 80, default);

-- INSERT INTO load VALUES (7, 'ae0d4229-9e62-4771-9fdc-74e6fa440596', 5, 70, default);
-- INSERT INTO load VALUES (8, 'ae0d4229-9e62-4771-9fdc-74e6fa440596', 12, 70, default);
-- INSERT INTO load VALUES (9, 'ae0d4229-9e62-4771-9fdc-74e6fa440596', 15, 70, default);

-- INSERT INTO load VALUES (10, '29065992-6967-4366-a08b-7a4a8ecbac00', 15, 60, default);
-- INSERT INTO load VALUES (11, '29065992-6967-4366-a08b-7a4a8ecbac00', 9, 40, default);
-- INSERT INTO load VALUES (12, '29065992-6967-4366-a08b-7a4a8ecbac00', 4, 80, default);

-- (select(Workout.c.id, Workout.c.user_id, Workout.c.exercise)
--      .where(Workout.date == date)
--      .join(Load, Load.workout == Workout.id)
--      .join(Exercise, Exercise.id == Workout.exercise)
--      .order_by(Workout.id, Load.id))

-- select e.exercise, l.reps, l.expect, l.fact from workout w 
-- join load as l 
--     on l.workout = w.id
-- join user_exercise as e 
--     on e.id = w.exercise
-- where w.date='01-01-2002 10:30:00' 
-- order by w.id, l.id;

-- select * from workout where date='01-01-2002 10:30:00';

-- COPY user_exercise(id, title)
-- FROM '/Users/iljavaleev/Dev/Gym/gym-back/tmp.csv'
-- DELIMITER '|'
-- CSV;