from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import sys

# Ensure backend folder is in path
sys.path.append(os.path.dirname(__file__))

from db import init_db, load_csv_to_db, get_all_customers_df, update_customer_clusters
from preprocessing import clean_data, scale_single_input, FEATURE_COLUMNS
from clustering import calculate_elbow, train_kmeans_model, predict_single
from insights import generate_cluster_profiles, get_single_prediction_insight, generate_business_insights

app = Flask(__name__)
CORS(app)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SAMPLE_CSV_PATH = os.path.join(BASE_DIR, 'sample_customer_data.csv')
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Global cached profiles state
CACHED_PROFILES = {}

# Auto-initialize database on startup if empty
with app.app_context():
    init_db()
    df_existing = get_all_customers_df()
    if len(df_existing) == 0 and os.path.exists(SAMPLE_CSV_PATH):
        load_csv_to_db(SAMPLE_CSV_PATH)
        # Train default initial K=5 model if sample data loaded
        df_init = get_all_customers_df()
        if len(df_init) > 0:
            df_cleaned, _ = clean_data(df_init)
            df_trained, _ = train_kmeans_model(df_cleaned, k=5)
            profiles, df_profiled = generate_cluster_profiles(df_trained)
            update_customer_clusters(df_profiled)
            CACHED_PROFILES = profiles

@app.route('/api/status', methods=['GET'])
def get_status():
    df = get_all_customers_df()
    is_trained = len(df) > 0 and 'cluster_id' in df.columns and (df['cluster_id'] != -1).any()
    k_val = len(df['cluster_id'].unique()) if is_trained else 0
    return jsonify({
        "status": "online",
        "total_customers": len(df),
        "is_trained": is_trained,
        "active_clusters": k_val if is_trained else 0
    })

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        # Check if requesting load sample dataset
        if request.is_json and request.json.get('use_sample', False):
            if os.path.exists(SAMPLE_CSV_PATH):
                success, msg = load_csv_to_db(SAMPLE_CSV_PATH)
                if success:
                    df = get_all_customers_df()
                    return jsonify({
                        "message": "Sample dataset loaded successfully!",
                        "total_records": len(df),
                        "columns": list(df.columns)
                    })
                return jsonify({"error": msg}), 400
            return jsonify({"error": "Sample dataset file not found"}), 404
        return jsonify({"error": "No file uploaded or invalid payload"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
        
    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV files are supported"}), 400
        
    filepath = os.path.join(UPLOADS_DIR, file.filename)
    file.save(filepath)
    
    success, msg = load_csv_to_db(filepath)
    if not success:
        return jsonify({"error": msg}), 400
        
    df = get_all_customers_df()
    return jsonify({
        "message": "Dataset uploaded and loaded into database successfully!",
        "total_records": len(df),
        "columns": list(df.columns)
    })

@app.route('/api/preprocess', methods=['POST'])
def preprocess_dataset():
    df = get_all_customers_df()
    if len(df) == 0:
        return jsonify({"error": "No dataset found. Please upload a dataset first."}), 400
        
    cleaned_df, stats = clean_data(df)
    # Save cleaned back to db
    update_customer_clusters(cleaned_df)
    
    return jsonify({
        "message": "Data preprocessing completed successfully!",
        "stats": stats
    })

@app.route('/api/elbow', methods=['GET'])
def get_elbow_data():
    df = get_all_customers_df()
    if len(df) == 0:
        return jsonify({"error": "No customer data available."}), 400
        
    elbow_res = calculate_elbow(df, k_min=2, k_max=10)
    return jsonify(elbow_res)

@app.route('/api/train', methods=['POST'])
def train_model():
    global CACHED_PROFILES
    data = request.json or {}
    k = int(data.get('k', 5))
    
    if k < 2 or k > 10:
        return jsonify({"error": "K must be between 2 and 10"}), 400
        
    df = get_all_customers_df()
    if len(df) == 0:
        return jsonify({"error": "No dataset found. Please upload customer data first."}), 400
        
    df_cleaned, _ = clean_data(df)
    df_trained, model_info = train_kmeans_model(df_cleaned, k=k)
    
    profiles, df_profiled = generate_cluster_profiles(df_trained)
    update_customer_clusters(df_profiled)
    CACHED_PROFILES = profiles
    
    return jsonify({
        "message": f"K-Means model successfully trained with K={k}!",
        "model_info": model_info,
        "profiles": profiles
    })

@app.route('/api/clusters', methods=['GET'])
def get_clusters():
    global CACHED_PROFILES
    df = get_all_customers_df()
    if len(df) == 0:
        return jsonify({"clusters": []})
        
    if not CACHED_PROFILES:
        profiles, _ = generate_cluster_profiles(df)
        CACHED_PROFILES = profiles
        
    cluster_list = list(CACHED_PROFILES.values())
    return jsonify({
        "total_clusters": len(cluster_list),
        "clusters": cluster_list
    })

@app.route('/api/customers', methods=['GET'])
def get_customers():
    df = get_all_customers_df()
    if len(df) == 0:
        return jsonify({"customers": [], "total": 0})
        
    # Search and Filtering params
    search = request.args.get('search', '').strip().lower()
    cluster_filter = request.args.get('cluster', 'all')
    gender_filter = request.args.get('gender', 'all')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    sort_by = request.args.get('sort_by', 'customer_id')
    sort_order = request.args.get('sort_order', 'asc')
    
    # Filter
    if search:
        df = df[df['customer_id'].str.lower().str.contains(search) | 
                df['segment_name'].str.lower().str.contains(search)]
                
    if cluster_filter != 'all':
        df = df[df['cluster_id'] == int(cluster_filter)]
        
    if gender_filter != 'all':
        df = df[df['gender'].str.lower() == gender_filter.lower()]
        
    # Sorting
    if sort_by in df.columns:
        ascending = True if sort_order == 'asc' else False
        df = df.sort_values(by=sort_by, ascending=ascending)
        
    total_records = len(df)
    
    # Pagination
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    df_page = df.iloc[start_idx:end_idx]
    
    records = df_page.to_dict(orient='records')
    
    return jsonify({
        "customers": records,
        "total": total_records,
        "page": page,
        "limit": limit,
        "total_pages": int(np.ceil(total_records / limit)) if limit > 0 else 1
    })

@app.route('/api/predict', methods=['POST'])
def predict_customer():
    global CACHED_PROFILES
    data = request.json or {}
    
    required = ['age', 'gender', 'annual_income', 'spending_score', 'purchase_frequency', 'avg_purchase_value']
    for req in required:
        if req not in data:
            return jsonify({"error": f"Missing required parameter: {req}"}), 400
            
    try:
        scaled_input = scale_single_input(data)
        cluster_id = predict_single(scaled_input)
        
        if not CACHED_PROFILES:
            df = get_all_customers_df()
            profiles, _ = generate_cluster_profiles(df)
            CACHED_PROFILES = profiles
            
        insight = get_single_prediction_insight(cluster_id, CACHED_PROFILES)
        
        return jsonify({
            "predicted_cluster": cluster_id,
            "segment_name": insight["segment_name"],
            "tagline": insight["tagline"],
            "badge_color": insight["badge_color"],
            "characteristics": insight["characteristics"],
            "recommendations": insight["recommendations"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/insights', methods=['GET'])
def get_insights():
    global CACHED_PROFILES
    df = get_all_customers_df()
    if not CACHED_PROFILES:
        profiles, _ = generate_cluster_profiles(df)
        CACHED_PROFILES = profiles
        
    res = generate_business_insights(df, CACHED_PROFILES)
    return jsonify(res)

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    global CACHED_PROFILES
    df = get_all_customers_df()
    
    if len(df) == 0:
        return jsonify({
            "total_customers": 0,
            "num_clusters": 0,
            "avg_income": 0,
            "avg_spending_score": 0,
            "cluster_distribution": [],
            "scatter_data": []
        })
        
    if not CACHED_PROFILES:
        profiles, _ = generate_cluster_profiles(df)
        CACHED_PROFILES = profiles
        
    num_clusters = len(CACHED_PROFILES) if CACHED_PROFILES else 0
    avg_inc = round(float(df['annual_income'].mean()), 1)
    avg_spend = round(float(df['spending_score'].mean()), 1)
    
    cluster_dist = []
    for cid, prof in CACHED_PROFILES.items():
        cluster_dist.append({
            "cluster_id": cid,
            "name": prof['segment_name'],
            "count": prof['count'],
            "percentage": prof['percentage'],
            "color": prof['badge_color']
        })
        
    # Sample down scatter plot points for smooth UI rendering if dataset is large
    scatter_sample = df.sample(min(200, len(df)), random_state=42) if len(df) > 0 else df
    scatter_points = []
    for _, row in scatter_sample.iterrows():
        scatter_points.append({
            "id": row['customer_id'],
            "age": int(row['age']),
            "income": float(row['annual_income']),
            "spending_score": float(row['spending_score']),
            "purchase_frequency": int(row['purchase_frequency']),
            "avg_purchase_value": float(row['avg_purchase_value']),
            "cluster_id": int(row['cluster_id']) if pd.notna(row['cluster_id']) else -1,
            "segment_name": str(row['segment_name']) if pd.notna(row['segment_name']) else "Unassigned"
        })

    return jsonify({
        "total_customers": len(df),
        "num_clusters": num_clusters,
        "avg_income": avg_inc,
        "avg_spending_score": avg_spend,
        "cluster_distribution": cluster_dist,
        "scatter_data": scatter_points
    })

if __name__ == '__main__':
    print("Starting Flask server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
