import numpy as np
from sklearn.cluster import KMeans
import joblib
import os
from preprocessing import scale_features, FEATURE_COLUMNS

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'kmeans_model.pkl')

def calculate_elbow(df, k_min=2, k_max=10):
    """
    Computes WCSS / Inertia for K ranging from k_min to k_max.
    Also calculates recommended optimal K using Elbow rule.
    """
    X_scaled, _ = scale_features(df, fit=False)
    elbow_data = []
    
    inertias = []
    k_values = list(range(k_min, k_max + 1))
    
    for k in k_values:
        kmeans = KMeans(n_clusters=k, init='k-means++', random_state=42, n_init=10)
        kmeans.fit(X_scaled)
        inertia = float(kmeans.inertia_)
        inertias.append(inertia)
        elbow_data.append({
            "k": k,
            "wcss": round(inertia, 2)
        })
        
    # Calculate recommended K using perpendicular distance from secant line (P1 to P2)
    # P1 = (x1, y1), P2 = (x2, y2)
    x1, y1 = float(k_values[0]), float(inertias[0])
    x2, y2 = float(k_values[-1]), float(inertias[-1])
    
    distances = []
    line_len = np.sqrt((y2 - y1)**2 + (x2 - x1)**2)
    for i in range(len(k_values)):
        x0, y0 = float(k_values[i]), float(inertias[i])
        # Perpendicular distance formula from point (x0, y0) to line (x1, y1)-(x2, y2)
        dist = np.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / line_len
        distances.append(dist)
        
    optimal_idx = int(np.argmax(distances))
    recommended_k = k_values[optimal_idx]
    
    explanation = (
        f"K={recommended_k} is recommended as it marks the point of maximum curvature ('Elbow') "
        f"where additional clusters produce diminishing returns in reducing Within-Cluster Sum of Squares (WCSS)."
    )
    
    return {
        "elbow_curve": elbow_data,
        "recommended_k": recommended_k,
        "explanation": explanation
    }

def train_kmeans_model(df, k=5):
    """
    Trains KMeans model with selected k, saves model pkl, and returns updated df with cluster assignments.
    """
    os.makedirs(MODELS_DIR, exist_ok=True)
    X_scaled, scaler = scale_features(df, fit=True)
    
    kmeans = KMeans(n_clusters=k, init='k-means++', random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    
    # Save model
    joblib.dump(kmeans, MODEL_PATH)
    
    df_result = df.copy()
    df_result['cluster_id'] = labels
    
    # Calculate inertia & centroids
    inertia = float(kmeans.inertia_)
    centroids_scaled = kmeans.cluster_centers_
    # Inverse transform centroids back to original feature space
    centroids_original = scaler.inverse_transform(centroids_scaled)
    
    centroids_info = []
    for cid in range(k):
        c_vals = centroids_original[cid]
        centroids_info.append({
            "cluster_id": cid,
            "age": round(float(c_vals[0]), 1),
            "annual_income": round(float(c_vals[1]), 1),
            "spending_score": round(float(c_vals[2]), 1),
            "purchase_frequency": round(float(c_vals[3]), 1),
            "avg_purchase_value": round(float(c_vals[4]), 1),
        })
        
    return df_result, {
        "k": k,
        "inertia": round(inertia, 2),
        "centroids": centroids_info
    }

def predict_single(scaled_features_matrix):
    """
    Predicts cluster ID for a scaled feature array using saved KMeans model.
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Trained model artifact not found. Please train the model first.")
        
    kmeans = joblib.load(MODEL_PATH)
    cluster_id = int(kmeans.predict(scaled_features_matrix)[0])
    return cluster_id
