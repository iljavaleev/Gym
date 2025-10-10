#!/bin/bash


CURRENT_DIR="$(pwd)/../setup/"
echo "The script is running in: $CURRENT_DIR"
source "$CURRENT_DIR/export.sh"

db_function(){
    drop_query="DELETE FROM $1;"
    copy_query="\\COPY $1 FROM '$2' DELIMITER '|' CSV HEADER"
    idx_query="SELECT setval('$1_id_seq', max(id)) FROM $1;"

    for item in "$drop_query" "$copy_query" "$idx_query"; do
        echo "psql -h ${DB_HOST} -U ${DB_USER} -d $3 -c $item"
        psql -h ${DB_HOST} -U ${DB_USER} -d $3 -c "$item"
    done
}
for db_name in ${DB_NAME} ${TEST_DB_NAME}; do
    psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$db_name'" | grep -q 1 || psql -U  ${DB_USER}  -c "CREATE DATABASE $db_name"
    psql -U postgres -d $db_name -a -f "$CURRENT_DIR/db_setup.sql"

    db_function  "endurance" "$CURRENT_DIR/data/${ENDURANCE_FILE_PATH}" "$db_name";
    db_function  "strength" "$CURRENT_DIR/data/${STRENGTH_FILE_PATH}" "$db_name";
    db_function  "user_exercise" "$CURRENT_DIR/data/${EXS_FILE_PATH}" "$db_name";
done
     