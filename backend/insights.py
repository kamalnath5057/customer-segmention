import pandas as pd
import numpy as np

def generate_cluster_profiles(df):
    """
    Computes summary stats for each cluster in df and assigns meaningful names dynamically.
    Returns: dictionary of cluster metadata indexed by cluster_id, updated df with segment_name.
    """
    if 'cluster_id' not in df.columns or df['cluster_id'].isnull().all() or (df['cluster_id'] == -1).all():
        return {}, df
        
    overall_mean_income = df['annual_income'].mean()
    overall_mean_spending = df['spending_score'].mean()
    overall_mean_freq = df['purchase_frequency'].mean()
    overall_mean_value = df['avg_purchase_value'].mean()
    
    cluster_groups = df.groupby('cluster_id')
    profiles = {}
    
    # Candidate persona names based on characteristics
    # We will score each cluster against persona rules
    assigned_df = df.copy()
    
    for cid, group in cluster_groups:
        if cid == -1:
            continue
            
        avg_age = float(group['age'].mean())
        avg_inc = float(group['annual_income'].mean())
        avg_spend = float(group['spending_score'].mean())
        avg_freq = float(group['purchase_frequency'].mean())
        avg_val = float(group['avg_purchase_value'].mean())
        count = len(group)
        percentage = round((count / len(df)) * 100, 1)
        
        # Dynamic segment naming logic based on income & spending & purchase metrics
        if avg_inc >= overall_mean_income * 1.05 and avg_spend >= overall_mean_spending * 1.05:
            segment_name = "Premium Spenders"
            tagline = "High income with high spending behavior and frequent purchases."
            badge_color = "purple"
            recommendations = [
                "Enroll in VIP Loyalty & Rewards programs.",
                "Provide early access to luxury or newly launched products.",
                "Offer dedicated concierge customer support.",
                "Send personalized premium gift bundles during holidays."
            ]
        elif avg_inc >= overall_mean_income * 1.05 and avg_spend < overall_mean_spending:
            segment_name = "High Value Savers"
            tagline = "High earning potential with cautious spending habits."
            badge_color = "emerald"
            recommendations = [
                "Highlight high-value long-term product ROI and guarantees.",
                "Send targeted premium value propositions and bundle discounts.",
                "Utilize subtle upselling for durability and quality upgrades.",
                "Encourage subscription plans with guaranteed savings."
            ]
        elif avg_inc < overall_mean_income and avg_spend >= overall_mean_spending * 1.05:
            segment_name = "Budget Enthusiasts"
            tagline = "Lower income bracket with passionate shopping enthusiasm."
            badge_color = "amber"
            recommendations = [
                "Promote flash sales, seasonal discount codes, and coupon deals.",
                "Offer Buy-Now-Pay-Later (BNPL) flexible payment terms.",
                "Encourage social media referrals for instant discount credits.",
                "Feature trending items under $50 with high visual appeal."
            ]
        elif avg_inc < overall_mean_income * 0.95 and avg_spend < overall_mean_spending * 0.95:
            segment_name = "Low Engagement Customers"
            tagline = "Low annual income and minimal purchasing frequency."
            badge_color = "rose"
            recommendations = [
                "Launch automated Win-Back email re-engagement campaigns.",
                "Send zero-friction free shipping coupons or welcome-back incentives.",
                "Conduct short survey feedback forms to analyze friction points.",
                "Push low-cost entry-level trial product offerings."
            ]
        else:
            segment_name = "Occasional Shoppers"
            tagline = "Moderate income and balanced, steady purchasing patterns."
            badge_color = "blue"
            recommendations = [
                "Implement milestone points programs to boost purchase frequency.",
                "Cross-sell complementary items based on previous cart items.",
                "Send seasonal newsletter product roundups and recommendations.",
                "Offer modest bulk purchase discount incentives."
            ]
            
        profiles[int(cid)] = {
            "cluster_id": int(cid),
            "segment_name": segment_name,
            "count": count,
            "percentage": percentage,
            "avg_age": round(avg_age, 1),
            "avg_income": round(avg_inc, 1),
            "avg_spending_score": round(avg_spend, 1),
            "avg_purchase_frequency": round(avg_freq, 1),
            "avg_purchase_value": round(avg_val, 1),
            "tagline": tagline,
            "badge_color": badge_color,
            "recommendations": recommendations
        }
        
        # Apply title to df rows
        assigned_df.loc[assigned_df['cluster_id'] == cid, 'segment_name'] = segment_name
        
    return profiles, assigned_df

def get_single_prediction_insight(cluster_id, profiles_dict):
    """
    Returns tailored insights & recommendations for a single predicted cluster.
    """
    if cluster_id in profiles_dict:
        prof = profiles_dict[cluster_id]
        return {
            "cluster_id": cluster_id,
            "segment_name": prof["segment_name"],
            "tagline": prof["tagline"],
            "badge_color": prof["badge_color"],
            "characteristics": {
                "avg_age": prof["avg_age"],
                "avg_income": f"${prof['avg_income']}k",
                "avg_spending_score": f"{prof['avg_spending_score']} / 100",
                "avg_purchase_frequency": f"{prof['avg_purchase_frequency']} / yr",
                "avg_purchase_value": f"${prof['avg_purchase_value']}"
            },
            "recommendations": prof["recommendations"]
        }
    else:
        # Fallback dynamic generator if profiles dictionary isn't pre-cached
        return {
            "cluster_id": cluster_id,
            "segment_name": f"Cluster {cluster_id}",
            "tagline": "Segment classified based on machine learning distance metric.",
            "badge_color": "indigo",
            "characteristics": {},
            "recommendations": ["Deliver targeted marketing offers based on shopping history."]
        }

def generate_business_insights(df, profiles_dict):
    """
    Generates high-level executive marketing insights across all clusters.
    """
    if not profiles_dict:
        return {
            "insights": ["Train the model to unlock automated executive business insights."],
            "highlights": {}
        }
        
    # Highest spending cluster
    highest_spend_cluster = max(profiles_dict.values(), key=lambda x: x['avg_spending_score'])
    # Highest income cluster
    highest_income_cluster = max(profiles_dict.values(), key=lambda x: x['avg_income'])
    # Largest customer population
    largest_population_cluster = max(profiles_dict.values(), key=lambda x: x['count'])
    # Lowest spending / engagement
    lowest_spend_cluster = min(profiles_dict.values(), key=lambda x: x['avg_spending_score'])
    
    total_customers = len(df)
    total_revenue_potential = sum([p['count'] * p['avg_purchase_frequency'] * p['avg_purchase_value'] for p in profiles_dict.values()])

    insights_list = [
        {
            "id": 1,
            "title": "Top Spending Powerhouse",
            "type": "success",
            "description": f"The '{highest_spend_cluster['segment_name']}' segment demonstrates the highest engagement with an average spending score of {highest_spend_cluster['avg_spending_score']}/100 and annual income of ${highest_spend_cluster['avg_income']}k.",
            "action": "Prioritize VIP loyalty perks and exclusive product previews for this group."
        },
        {
            "id": 2,
            "title": "Untapped High-Income Opportunity",
            "type": "warning",
            "description": f"'{highest_income_cluster['segment_name']}' members earn ${highest_income_cluster['avg_income']}k annually but retain a lower spending score of {highest_income_cluster['avg_spending_score']}/100.",
            "action": "Launch premium quality campaigns showcasing long-term product value and warranty."
        },
        {
            "id": 3,
            "title": "Core Revenue Volume Driver",
            "type": "info",
            "description": f"'{largest_population_cluster['segment_name']}' represents your largest customer cohort with {largest_population_cluster['count']} active customers ({largest_population_cluster['percentage']}% of total userbase).",
            "action": "Maintain high retention with consistent seasonal rewards and automated cart reminders."
        },
        {
            "id": 4,
            "title": "Churn Prevention & Re-engagement Alert",
            "type": "danger",
            "description": f"'{lowest_spend_cluster['segment_name']}' shows low purchasing activity ({lowest_spend_cluster['avg_purchase_frequency']} orders/yr) and spending score ({lowest_spend_cluster['avg_spending_score']}).",
            "action": "Deploy automated re-engagement workflows featuring time-sensitive promotional codes."
        }
    ]

    highlights = {
        "highest_spending_segment": highest_spend_cluster['segment_name'],
        "highest_income_segment": highest_income_cluster['segment_name'],
        "largest_segment": largest_population_cluster['segment_name'],
        "total_revenue_potential": round(total_revenue_potential, 2)
    }

    return {
        "insights": insights_list,
        "highlights": highlights
    }
