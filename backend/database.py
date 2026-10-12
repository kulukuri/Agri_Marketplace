import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='agri_db',
            user='root',      # Default XAMPP username
            password=''       # Default XAMPP password is empty
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None