import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import os

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
SCALER_PATH = os.path.join(MODELS_DIR, 'scaler.pkl')

FEATURE_COLUMNS = [
    'age',
    'annual_income',
    'spending_score',
    'purchase_frequency',
    'avg_purchase_value'
]

def clean_data(df):
    """
    Cleans dataset by handling missing values and removing duplicate customer records.
    Returns: cleaned_df, metadata stats dict
    """
    initial_rows = len(df)
    missing_summary = df[FEATURE_COLUMNS].isnull().sum().to_dict()
    total_missing = sum(missing_summary.values())
    
    # 1. Remove duplicate customer IDs or exact feature rows
    df_cleaned = df.drop_duplicates(subset=['customer_id']).copy()
    duplicates_removed = initial_rows - len(df_cleaned)
    
    # 2. Impute missing numerical values with column median
    for col in FEATURE_COLUMNS:
        if df_cleaned[col].isnull().sum() > 0:
            median_val = df_cleaned[col].median()
            df_cleaned[col] = df_cleaned[col].fillna(median_val)
            
    # 3. Ensure proper data types
    df_cleaned['age'] = df_cleaned['age'].astype(int)
    df_cleaned['annual_income'] = df_cleaned['annual_income'].astype(float)
    df_cleaned['spending_score'] = df_cleaned['spending_score'].astype(float)
    df_cleaned['purchase_frequency'] = df_cleaned['purchase_frequency'].astype(int)
    df_cleaned['avg_purchase_value'] = df_cleaned['avg_purchase_value'].astype(float)

    stats = {
        "initial_rows": initial_rows,
        "final_rows": len(df_cleaned),
        "duplicates_removed": duplicates_removed,
        "missing_values_imputed": total_missing,
        "missing_summary": missing_summary,
        "features_processed": FEATURE_COLUMNS
    }
    
    return df_cleaned, stats

def scale_features(df, fit=True):
    """
    Scales numerical features using StandardScaler.
    Saves scaler artifact if fit=True.
    Returns: scaled feature matrix X_scaled, scaler instance
    """
    os.makedirs(MODELS_DIR, exist_ok=True)
    X = df[FEATURE_COLUMNS].values
    
    if fit:
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        joblib.dump(scaler, SCALER_PATH)
    else:
        if os.path.exists(SCALER_PATH):
            scaler = joblib.load(SCALER_PATH)
            X_scaled = scaler.transform(X)
        else:
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            joblib.dump(scaler, SCALER_PATH)
            
    return X_scaled, scaler

def scale_single_input(feature_dict):
    """
    Scales a single dictionary of features for real-time prediction.
    """
    os.makedirs(MODELS_DIR, exist_ok=True)
    values = [[
        float(feature_dict.get('age', 0)),
        float(feature_dict.get('annual_income', 0)),
        float(feature_dict.get('spending_score', 0)),
        float(feature_dict.get('purchase_frequency', 0)),
        float(feature_dict.get('avg_purchase_value', 0))
    ]]
    
    if os.path.exists(SCALER_PATH):
        scaler = joblib.load(SCALER_PATH)
        return scaler.transform(values)
    else:
        # Fallback default scaling if no scaler saved yet
        return values
