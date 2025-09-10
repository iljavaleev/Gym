!/bin/bash
# psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || psql -U  ${DB_USER}  -c "CREATE DATABASE ${DB_NAME}"
# psql -U postgres -d ${DB_NAME} -a -f ./db_setup.sql


db_function(){
    drop_query="DELETE FROM $1;"
    copy_query="\\COPY $1 FROM '$2' DELIMITER '|' CSV HEADER"
    idx_query="SELECT setval('$1_id_seq', max(id)) FROM $1;"

    for item in "$drop_query" "$copy_query" "$idx_query"; do
        echo "psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -c $item"
        psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -c "$item"
    done
}

db_function  "endurance" ./data/${ENDURANCE_FILE_PATH};
db_function  "strength" ./data/${STRENGTH_FILE_PATH};
db_function  "user_exercise" ./data/${EXS_FILE_PATH};
     