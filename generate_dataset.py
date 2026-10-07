import pandas as pd
import numpy as np
import os

np.random.seed(42)
n_samples = 550

# Generate 5 distinct synthetic segments with natural variance
# 1. Premium High Spenders (~120 samples)
# 2. High Income Savers (~110 samples)
# 3. Budget Enthusiasts (~110 samples)
# 4. Low Engagement (~100 samples)
# 5. Moderate Shoppers (~110 samples)

clusters_data = [
    # Segment 1: Premium High Spenders
    {"n": 120, "age": (26, 50), "inc": (82, 138), "spend": (72, 98), "freq": (26, 48), "val": (220, 480)},
    # Segment 2: High Income Savers
    {"n": 110, "age": (32, 65), "inc": (78, 135), "spend": (10, 38), "freq": (6, 18), "val": (140, 320)},
    # Segment 3: Budget Enthusiasts
    {"n": 110, "age": (18, 38), "inc": (18, 46), "spend": (68, 96), "freq": (22, 44), "val": (35, 95)},
    # Segment 4: Low Engagement
    {"n": 100, "age": (22, 68), "inc": (15, 44), "spend": (8, 36), "freq": (3, 14), "val": (25, 80)},
    # Segment 5: Moderate Shoppers
    {"n": 110, "age": (25, 58), "inc": (48, 76), "spend": (40, 64), "freq": (14, 25), "val": (85, 185)},
]

all_records = []
customer_id = 1001

for seg in clusters_data:
    n = seg["n"]
    ages = np.random.randint(seg["age"][0], seg["age"][1] + 1, n)
    incomes = np.random.randint(seg["inc"][0], seg["inc"][1] + 1, n)
    spends = np.random.randint(seg["spend"][0], seg["spend"][1] + 1, n)
    freqs = np.random.randint(seg["freq"][0], seg["freq"][1] + 1, n)
    vals = np.random.randint(seg["val"][0], seg["val"][1] + 1, n)
    genders = np.random.choice(["Male", "Female"], n, p=[0.48, 0.52])

    for i in range(n):
        all_records.append({
            "CustomerID": f"CUST-{customer_id}",
            "Age": int(ages[i]),
            "Gender": str(genders[i]),
            "Annual Income": int(incomes[i]),
            "Spending Score": int(spends[i]),
            "Purchase Frequency": int(freqs[i]),
            "Average Purchase Value": int(vals[i])
        })
        customer_id += 1

df = pd.DataFrame(all_records)
# Shuffle rows
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Save to root and backend/dataset
df.to_csv("sample_customer_data.csv", index=False)
os.makedirs("backend/dataset", exist_ok=True)
df.to_csv("backend/dataset/sample_customer_data.csv", index=False)
print(f"Generated {len(df)} customer records successfully!")
