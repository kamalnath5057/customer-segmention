# Customer Segmentation Using K-Means Clustering

A complete, production-grade Machine Learning web application designed to segment customers based on demographics, annual income, spending scores, purchase frequencies, and transaction values using the **K-Means Clustering** algorithm and **StandardScaler**.

![Project Status](https://img.shields.io/badge/Status-Complete-emerald)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-blue)
![Frontend Stack](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Tailwind-indigo)
![Backend Stack](https://img.shields.io/badge/Backend-Python%20Flask%20%7C%20SQLite-green)

---

## 📌 Project Overview

Customer segmentation is the strategic process of dividing a target market into distinct groups based on shared attributes and purchasing habits. This application enables businesses to:
1. Identify high-value VIP spenders vs. price-sensitive budget shoppers automatically.
2. Optimize marketing spend by tailoring campaigns to specific cluster personas.
3. Classify newly acquired customers in real-time with tailored strategic recommendations.

---

## 🚀 Key Features

1. **Executive Dashboard**: High-level KPIs, cluster distribution donut charts, and cluster summary breakdown.
2. **Dataset Management**: Drag-and-drop CSV upload, 550-record sample dataset loader, and data preview with validation badges.
3. **Data Preprocessing**: Median missing value imputation, duplicate row filtering, and Z-Score feature scaling using `StandardScaler`.
4. **K-Means Studio & Elbow Analyzer**: Interactive WCSS line chart for $K=2$ to $10$, automated optimal $K$ detection, inertia readout, and inverse-transformed centroid tables.
5. **Customer Clusters**: Dynamic persona naming (*Premium Spenders*, *High Value Savers*, *Budget Enthusiasts*, *Low Engagement*, *Occasional Shoppers*) with tailored action plans.
6. **Visualizations Suite**: Interactive Recharts scatter plots (Income vs Spending, Age vs Spending, Income vs Frequency) and 3D-style multi-metric bubble plots.
7. **Real-Time Customer Segment Predictor**: Input form to instantly classify new customer profiles and return tailored marketing recommendations.
8. **Customer Database Table**: Grid view with text search, multi-column sorting, cluster filtering, and pagination.
9. **Automated Business Insights**: Executive intelligence identifying top spenders, revenue drivers, churn risks, and upsell targets.
10. **Viva & Project Report**: Embedded academic and mini-project report with mathematical derivations and architecture explanations.

---

## 🛠️ Technology Stack

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons | Responsive SaaS Analytics UI |
| **Backend** | Python Flask, REST API, SQLite | Web server & data persistence |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Joblib | K-Means, StandardScaler, model persistence |

---

## 📊 Dataset Information

The project includes a pre-generated 550-record realistic dataset (`sample_customer_data.csv`) containing:

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `CustomerID` | String | Unique customer identifier (e.g. CUST-1001) |
| `Age` | Integer | Customer age (18 to 70 years) |
| `Gender` | String | Male / Female |
| `Annual Income` | Float | Annual income in thousands ($k) |
| `Spending Score` | Float | Propensity to spend score (1 to 100) |
| `Purchase Frequency` | Integer | Orders placed per year |
| `Average Purchase Value` | Float | Average order value ($) |

---

## 🧮 Machine Learning Implementation

### 1. Feature Standardization
Euclidean distance calculation in K-Means requires features to be normalized to prevent high-magnitude attributes from dominating:
$$z = \frac{x - \mu}{\sigma}$$

### 2. K-Means Clustering & WCSS
Iteratively minimizes Within-Cluster Sum of Squares (WCSS):
$$\text{WCSS} = \sum_{i=1}^{n} (x_i - \mu_{c_i})^2$$

### 3. Model Persistence
Trained models and scalers are saved using `joblib` in the `models/` directory:
- `models/kmeans_model.pkl`
- `models/scaler.pkl`

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | System health check and database state |
| `POST` | `/api/upload` | Ingest CSV or load 550-record sample dataset |
| `POST` | `/api/preprocess` | Clean missing values, remove duplicates, scale features |
| `GET` | `/api/elbow` | Compute WCSS curve for $K=2$ to $10$ |
| `POST` | `/api/train` | Fit `KMeans(n_clusters=k)` and save model artifact |
| `GET` | `/api/clusters` | Return cluster summary profiles & recommendations |
| `GET` | `/api/customers` | Paginated, filterable, searchable customer records |
| `POST` | `/api/predict` | Classify single customer profile into a segment |
| `GET` | `/api/insights` | Generate executive business insights |
| `GET` | `/api/dashboard` | Return aggregated dashboard summary statistics |

---

## 📦 Installation & Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+ and npm

### 1. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 🏃 Running the Application

### Step 1: Start Flask Backend Server
```bash
# From the project root
python backend/app.py
```
*(The Flask server starts at `http://localhost:5000` and automatically initializes the SQLite database with 550 sample records).*

### Step 2: Start React Frontend Dev Server
```bash
# In a new terminal window under frontend/
cd frontend
npm run dev
```
*(Open `http://localhost:3000` in your web browser).*

---

## 💡 How to Demonstrate for College Viva / Engineering Presentation

1. **Overview & Tech Stack**: Open the **Home Page** to explain the project objectives, importance of customer segmentation, and technology stack.
2. **Dashboard**: Navigate to the **Executive Dashboard** to showcase aggregate KPIs and initial cluster distribution donut charts.
3. **Dataset & Preprocessing**: Go to **Dataset & Cleaning** tab. Show raw customer data, click **Run Preprocessing Pipeline**, and observe median imputation stats.
4. **K-Means & Elbow Studio**: Open **K-Means Studio**. Point out the **Elbow Method Line Chart** (WCSS vs K), explain how $K=5$ was selected, and click **Train K-Means Model**.
5. **Customer Clusters**: Inspect the **Customer Clusters** tab to demonstrate dynamic segment profiling (*Premium Spenders*, *High Value Savers*, etc.) and tailored action plans.
6. **Visualizations**: Show scatter plots under **Visualizations Suite** demonstrating clear spatial cluster separation.
7. **Real-time Customer Prediction**: Go to **Segment Predictor**. Adjust Age, Annual Income, Spending Score, and Purchase Frequency sliders, then click **Predict Customer Segment** to demonstrate live classification.
8. **Project Report**: Show the embedded **Viva & Project Report** page for academic documentation.
# customer-segmention
