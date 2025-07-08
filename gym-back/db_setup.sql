-- DELETE FROM user_exercise;
-- DELETE FROM workout;
-- DELETE FROM load;

-- INSERT INTO user_exercise VALUES (1, 1, 'сед');
-- INSERT INTO user_exercise VALUES (2, 1, 'бицепс');
-- INSERT INTO user_exercise VALUES (3, 1, 'квадрицепс');
-- INSERT INTO user_exercise VALUES (4, 1, 'трицепс');

-- INSERT INTO workout VALUES (1, 1, 1, '01-01-2002 10:30:00');
-- INSERT INTO workout VALUES (2, 1, 2, '01-01-2002 10:30:00');
-- INSERT INTO workout VALUES (3, 1, 3, '01-01-2002 10:30:00');
-- INSERT INTO workout VALUES (4, 1, 4, '01-01-2002 10:30:00');

-- INSERT INTO load VALUES (1, 1, 8, 100, default);
-- INSERT INTO load VALUES (2, 1, 9, 100, default);
-- INSERT INTO load VALUES (3, 1, 10, 100, default);

-- INSERT INTO load VALUES (4, 2, 18, 80, default);
-- INSERT INTO load VALUES (5, 2, 19, 80, default);
-- INSERT INTO load VALUES (6, 2, 20, 80, default);

-- INSERT INTO load VALUES (7, 3, 5, 70, default);
-- INSERT INTO load VALUES (8, 3, 12, 70, default);
-- INSERT INTO load VALUES (9, 3, 15, 70, default);

-- INSERT INTO load VALUES (10, 4, 15, 60, default);
-- INSERT INTO load VALUES (11, 4, 9, 40, default);
-- INSERT INTO load VALUES (12, 4, 4, 80, default);

-- (select(Workout.c.id, Workout.c.user_id, Workout.c.exercise)
--      .where(Workout.date == date)
--      .join(Load, Load.workout == Workout.id)
--      .join(Exercise, Exercise.id == Workout.exercise)
--      .order_by(Workout.id, Load.id))

-- select e.exercise, l.reps, l.expect, l.fact from Workout w 
-- join load as l 
--     on l.workout = w.id
-- join user_exercise as e 
--     on e.id = w.exercise
-- where w.date='01-01-2002 10:30:00' 
-- order by w.id, l.id