import sqlite3
import pandas as pd
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'customer_segmentation.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id TEXT UNIQUE NOT NULL,
            age INTEGER,
            gender TEXT,
            annual_income REAL,
            spending_score REAL,
            purchase_frequency INTEGER,
            avg_purchase_value REAL,
            cluster_id INTEGER DEFAULT -1,
            segment_name TEXT DEFAULT 'Unassigned',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def load_csv_to_db(csv_filepath):
    init_db()
    if not os.path.exists(csv_filepath):
        return False, f"File {csv_filepath} not found."
    
    try:
        df = pd.read_csv(csv_filepath)
        # Normalize column names
        column_map = {
            'CustomerID': 'customer_id',
            'Age': 'age',
            'Gender': 'gender',
            'Annual Income': 'annual_income',
            'Spending Score': 'spending_score',
            'Purchase Frequency': 'purchase_frequency',
            'Average Purchase Value': 'avg_purchase_value'
        }
        df = df.rename(columns=column_map)
        
        required_cols = ['customer_id', 'age', 'gender', 'annual_income', 'spending_score', 'purchase_frequency', 'avg_purchase_value']
        for col in required_cols:
            if col not in df.columns:
                return False, f"Missing required column: {col}"
        
        conn = get_connection()
        cursor = conn.cursor()
        
        # Clear existing data on re-import
        cursor.execute("DELETE FROM customers")
        
        inserted_count = 0
        for idx, row in df.iterrows():
            cid = str(row['customer_id']) if pd.notna(row['customer_id']) else f"CUST-{idx+1000}"
            cursor.execute('''
                INSERT OR REPLACE INTO customers 
                (customer_id, age, gender, annual_income, spending_score, purchase_frequency, avg_purchase_value, cluster_id, segment_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, -1, 'Unassigned')
            ''', (
                cid,
                int(row['age']) if pd.notna(row['age']) else None,
                str(row['gender']) if pd.notna(row['gender']) else 'Other',
                float(row['annual_income']) if pd.notna(row['annual_income']) else None,
                float(row['spending_score']) if pd.notna(row['spending_score']) else None,
                int(row['purchase_frequency']) if pd.notna(row['purchase_frequency']) else None,
                float(row['avg_purchase_value']) if pd.notna(row['avg_purchase_value']) else None
            ))
            inserted_count += 1
            
        conn.commit()
        conn.close()
        return True, f"Successfully loaded {inserted_count} records into database."
    except Exception as e:
        return False, str(e)

def get_all_customers_df():
    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM customers", conn)
    conn.close()
    return df

def update_customer_clusters(df_with_clusters):
    conn = get_connection()
    cursor = conn.cursor()
    for _, row in df_with_clusters.iterrows():
        cursor.execute('''
            UPDATE customers
            SET cluster_id = ?, segment_name = ?
            WHERE customer_id = ?
        ''', (int(row['cluster_id']), str(row['segment_name']), str(row['customer_id'])))
    conn.commit()
    conn.close()

def clear_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM customers")
    conn.commit()
    conn.close()
