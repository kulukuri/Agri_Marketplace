import mysql.connector
from datetime import datetime, timedelta
import random

def generate_mock_history():
    conn = mysql.connector.connect(
        host='localhost',
        database='agri_db',
        user='root',
        password=''
    )
    cursor = conn.cursor()

    commodities = [
        {'name': 'Tomato', 'base': 2800},
        {'name': 'Rice', 'base': 4200},
        {'name': 'Jaggery', 'base': 4000}
    ]

    insert_query = """
    INSERT INTO mandi_prices (state, district, market, commodity, min_price, max_price, modal_price, arrival_date)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    # Generate data for the last 7 days
    for i in range(7):
        target_date = (datetime.today() - timedelta(days=i)).strftime('%Y-%m-%d')
        
        for crop in commodities:
            modal = crop['base'] + random.randint(-300, 300)
            min_p = modal - random.randint(100, 400)
            max_p = modal + random.randint(100, 400)
            
            market = 'Anakapalle' if crop['name'] == 'Jaggery' else 'Vizianagaram'
            district = 'Visakhapatnam' if crop['name'] == 'Jaggery' else 'Vizianagaram'

            values = ('Andhra Pradesh', district, market, crop['name'], min_p, max_p, modal, target_date)
            cursor.execute(insert_query, values)

    conn.commit()
    cursor.close()
    conn.close()
    print("Successfully populated database with 7 days of data!")

if __name__ == "__main__":
    generate_mock_history()