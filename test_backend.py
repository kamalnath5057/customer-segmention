import requests
import time
import subprocess
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from db import init_db, load_csv_to_db, get_all_customers_df
from preprocessing import clean_data, scale_single_input
from clustering import calculate_elbow, train_kmeans_model, predict_single
from insights import generate_cluster_profiles, get_single_prediction_insight, generate_business_insights

print("--- Step 1: Testing DB Initialization & Sample Dataset ---")
init_db()
success, msg = load_csv_to_db("sample_customer_data.csv")
print(f"Load CSV Status: {success} | Message: {msg}")

df = get_all_customers_df()
print(f"Total Database Rows: {len(df)}")
assert len(df) >= 500, "Dataset should have at least 500 records!"

print("\n--- Step 2: Testing Data Preprocessing ---")
cleaned_df, stats = clean_data(df)
print(f"Preprocessing Stats: {stats}")
assert len(cleaned_df) > 0

print("\n--- Step 3: Testing Elbow Method Calculation ---")
elbow_res = calculate_elbow(cleaned_df, k_min=2, k_max=10)
print(f"Recommended K: {elbow_res['recommended_k']}")
print(f"Elbow Curve points count: {len(elbow_res['elbow_curve'])}")
assert len(elbow_res['elbow_curve']) == 9

print("\n--- Step 4: Testing K-Means Training & Centroids ---")
df_trained, model_info = train_kmeans_model(cleaned_df, k=5)
print(f"Inertia: {model_info['inertia']}")
print(f"Centroids Count: {len(model_info['centroids'])}")
assert len(model_info['centroids']) == 5

print("\n--- Step 5: Testing Dynamic Profiles & Business Insights ---")
profiles, df_profiled = generate_cluster_profiles(df_trained)
for cid, prof in profiles.items():
    print(f"  Cluster {cid}: {prof['segment_name']} ({prof['count']} customers, ${prof['avg_income']}k avg income)")

insights = generate_business_insights(df_profiled, profiles)
print(f"Generated Insights Count: {len(insights['insights'])}")

print("\n--- Step 6: Testing Real-Time Prediction ---")
sample_input = {
    'age': 35,
    'gender': 'Female',
    'annual_income': 95,
    'spending_score': 85,
    'purchase_frequency': 32,
    'avg_purchase_value': 310
}
scaled_in = scale_single_input(sample_input)
pred_cluster = predict_single(scaled_in)
single_insight = get_single_prediction_insight(pred_cluster, profiles)
print(f"Predicted Cluster: {pred_cluster} -> {single_insight['segment_name']}")
print(f"Recommendations: {single_insight['recommendations'][0]}")

print("\n[SUCCESS] ALL BACKEND ML PIPELINE TESTS PASSED CLEANLY!")
