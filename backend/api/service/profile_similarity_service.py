import gower
import pandas as pd
from typing import List, Dict, Any
from sklearn.preprocessing import MultiLabelBinarizer
from datetime import datetime
from config.appwrite_config import (
    client,
    databases,
    fireSaleDb,
    userProfileCollection,
    socialMediaCollection,
    communicationCollection,
    locationCollection,
    behaviorMetadataCollection
)
from datetime import datetime

def flatten_user_profile(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Flattens nested profile structure into a flat dictionary for similarity comparison."""
    flat = {}

    # Basic info
    basic = profile.get('basic_info', {})
    flat['age'] = basic.get('age')
    flat['consumer_type'] = basic.get('consumer_type')

    # Social media
    social = profile.get('social_media', {})
    flat['total_posts'] = social.get('total_posts')
    flat['total_likes'] = social.get('total_likes')
    flat['total_followers'] = social.get('total_followers')
    flat['last_active'] = social.get('last_active')
    flat['platforms'] = list(set(social.get('platforms', [])))
    flat['combined_interests'] = list(set(social.get('combined_interests', [])))
    flat['combined_groups'] = list(set(social.get('combined_groups', [])))

    # Email interactions
    email = profile.get('email_interactions', {})
    flat['total_interactions'] = email.get('total_interactions')
    flat['common_topics'] = list(set(email.get('common_topics', [])))
    flat['last_contact_date'] = email.get('last_contact_date')

    # Behavioral data
    behavior = profile.get('behavioral_data', {})
    flat['total_active_hours'] = behavior.get('total_active_hours')
    flat['avg_screen_time'] = behavior.get('avg_screen_time')
    flat['devices'] = list(set(behavior.get('devices', [])))
    flat['app_categories'] = list(set(behavior.get('app_categories', [])))

    # Derived insights
    insights = profile.get('derived_insights', {})
    flat['activity_level'] = insights.get('activity_level')
    flat['primary_interests'] = list(set(insights.get('primary_interests', [])))
    if 'communication_patterns' in insights:
        flat['primary_medium'] = insights['communication_patterns'].get('primary_medium')
        flat['recent_activity'] = insights['communication_patterns'].get('recent_activity')

    return flat

def preprocess_profiles(profiles: List[Dict[str, Any]]) -> pd.DataFrame:
    """Converts list of profiles into a Gower-compatible DataFrame."""
    flattened = [flatten_user_profile(p) for p in profiles]
    df = pd.DataFrame(flattened)

    # Convert datetime strings to datetime objects and make them naive (remove timezone)
    for col in ['last_active', 'last_contact_date', 'recent_activity']:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce').dt.tz_localize(None)

    # Binarize multi-label categorical fields
    multilabel_fields = ['platforms', 'combined_interests', 'combined_groups',
                         'common_topics', 'devices', 'app_categories', 'primary_interests']
    
    for field in multilabel_fields:
        if field in df.columns:
            mlb = MultiLabelBinarizer()
            transformed = mlb.fit_transform(df[field])
            binarized_df = pd.DataFrame(transformed, columns=[f"{field}_{cls}" for cls in mlb.classes_])
            df = pd.concat([df.drop(columns=[field]), binarized_df], axis=1)

    return df

def compute_similarity_matrix(profiles: List[Dict[str, Any]]) -> pd.DataFrame:
    """Computes Gower similarity matrix between profiles."""
    df = preprocess_profiles(profiles)
    similarity_matrix = 1 - gower.gower_matrix(df)  # Gower distance → similarity
    return pd.DataFrame(similarity_matrix)


def get_top_k_similar_profiles(similarity_df: pd.DataFrame, consol_profiles: list, k: int = 5):
    """
    Returns the top-k user profiles with the highest total similarity to others.

    Parameters:
        similarity_df: DataFrame containing similarity scores.
        consol_profiles: List of original profile dicts.
        k: Number of top profiles to return.

    Returns:
        List of top-k profile dicts.
    """
    print(len(consol_profiles))
    similarity_scores = similarity_df.copy()

    # Exclude similarity values that are 0 or 1
    filtered_scores = similarity_scores.map(lambda x: x if 0 < x < 1 else 0.0)

    # Sum the filtered similarity scores per profile
    total_similarity = filtered_scores.sum(axis=1)

    # Get top k user_ids by similarity score
    top_k_ids = total_similarity.sort_values(ascending=False).head(k).index.tolist()

    print(top_k_ids)
    
    # Match user_ids back to consol_profiles
    # top_k_profiles = [profile for profile in consol_profiles if profile["basic_info"]["user_id"] in top_k_ids]
    top_k_profiles = []
    for i in top_k_ids:
        top_k_profiles.append(consol_profiles[i])
    
    return top_k_profiles
