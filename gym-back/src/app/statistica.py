import adbc_driver_postgresql.dbapi
import pyarrow
import pyarrow.compute as pc

class Statistika:
    URI = "postgresql://postgres:postgres@localhost:5432/gymdb"

    # статистика по упражнению 


    def execute(self, query) -> pyarrow.Table:
        with adbc_driver_postgresql.dbapi.connect(self.URI) as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                table: pyarrow.Table = cursor.fetch_arrow_table()
                min_max_result = pc.min_max(table['numbers'])

                # Access the min and max values
                min_value = min_max_result.min.as_py()
                max_value = min_max_result.max.as_py()

                print(f"Minimum value in 'numbers' column: {min_value}")
                print(f"Maximum value in 'numbers' column: {max_value}")
                