from datetime import datetime

def construct_consolidated_profile(user_profile, social_media_data, email_data, behavioral_data):
    """
    Constructs a consolidated user profile from multiple data sources.
    
    Args:
        user_profile: dict with basic user information
        social_media_data: list of social media data points
        email_data: list of email interaction data points
        behavioral_data: list of behavioral data points
        
    Returns:
        A consolidated profile dictionary with normalized, combined information
    """
    
    # Initialize consolidated profile with base user data
    consolidated = {
        "basic_info": {
            "user_id": user_profile["user_id"],
            "name": user_profile["name"],
            "email": user_profile["email"],
            "age": user_profile["age"],
            "consumer_type": user_profile["consumer_type"],
            "signup_date": user_profile["signup_date"]
        },
        "social_media": _process_social_media(social_media_data),
        "email_interactions": _process_email_data(email_data),
        "behavioral_data": _process_behavioral_data(behavioral_data),
        "derived_insights": {}
    }
    
    # Generate cross-domain insights
    consolidated["derived_insights"] = _generate_insights(consolidated)
    
    return consolidated


def _process_social_media(data_points):
    """Aggregate and normalize social media data"""
    processed = {
        "platforms": [],
        "total_posts": 0,
        "total_likes": 0,
        "total_followers": 0,
        "combined_interests": [],
        "combined_groups": [],
        "last_active": None
    }
    
    interest_counter = {}
    group_counter = {}
    
    for point in data_points:
        processed["platforms"].append(point["platform"])
        processed["total_posts"] += point.get("post_count", 0)
        processed["total_likes"] += point.get("like_count", 0)
        processed["total_followers"] += point.get("follower_count", 0)
        
        # Process interests
        if point.get("top_interests"):
            try:
                interests = json.loads(point["top_interests"]).get("keywords", [])
                for interest in interests:
                    interest_counter[interest] = interest_counter.get(interest, 0) + 1
            except:
                pass
                
        # Process groups
        if point.get("groups"):
            try:
                groups = json.loads(point["groups"]).get("associated_grps", [])
                for group in groups:
                    group_counter[group] = group_counter.get(group, 0) + 1
            except:
                pass
                
        # Track most recent activity
        if point.get("last_active"):
            point_time = datetime.fromisoformat(point["last_active"])
            if not processed["last_active"] or point_time > datetime.fromisoformat(processed["last_active"]):
                processed["last_active"] = point["last_active"]
    
    # Sort and store top interests/groups
    processed["combined_interests"] = [item[0] for item in 
                                      sorted(interest_counter.items(), 
                                             key=lambda x: x[1], reverse=True)[:10]]
    processed["combined_groups"] = [item[0] for item in 
                                   sorted(group_counter.items(), 
                                          key=lambda x: x[1], reverse=True)[:5]]
    
    return processed


def _process_email_data(data_points):
    """Aggregate and normalize email interaction data"""
    processed = {
        "total_interactions": 0,
        "frequent_contacts": {},
        "common_topics": [],
        "last_contact_date": None
    }
    
    topic_counter = {}
    contact_counter = {}
    
    for point in data_points:
        processed["total_interactions"] += point.get("interaction_count", 0)
        
        # Count contacts
        contact_id = point.get("contacted_user_id")
        if contact_id:
            contact_counter[contact_id] = contact_counter.get(contact_id, 0) + point.get("interaction_count", 0)
        
        # Process topics
        if point.get("topics"):
            try:
                topics = json.loads(point["topics"]).get("email_topic_keywords", [])
                for topic in topics:
                    topic_counter[topic] = topic_counter.get(topic, 0) + 1
            except:
                pass
                
        # Track most recent contact
        if point.get("last_contact_date"):
            point_time = datetime.fromisoformat(point["last_contact_date"])
            if not processed["last_contact_date"] or point_time > datetime.fromisoformat(processed["last_contact_date"]):
                processed["last_contact_date"] = point["last_contact_date"]
    
    # Sort and store top topics/contacts
    processed["common_topics"] = [item[0] for item in 
                                 sorted(topic_counter.items(), 
                                        key=lambda x: x[1], reverse=True)[:10]]
    processed["frequent_contacts"] = dict(sorted(contact_counter.items(), 
                                               key=lambda x: x[1], reverse=True)[:5])
    
    return processed


def _process_behavioral_data(data_points):
    """Aggregate and normalize behavioral data"""
    processed = {
        "devices": set(),
        "total_active_hours": 0,
        "avg_screen_time": 0,
        "app_categories": []
    }
    
    category_counter = {}
    screen_times = []
    active_hours = []

    if data_points:
    
        for point in data_points:
            if point.get("device_type"):
                processed["devices"].add(point["device_type"])
                
            if point.get("active_hours"):
                try:
                    active_hours.append(float(point["active_hours"]))
                except:
                    pass
                    
            if point.get("average_daily_screen_time"):
                screen_times.append(point["average_daily_screen_time"])
                
            # Process app categories
            if point.get("preferred_app_categories"):
                try:
                    categories = json.loads(point["preferred_app_categories"]).get("app_categories", [])
                    for category in categories:
                        category_counter[category] = category_counter.get(category, 0) + 1
                except:
                    pass
    
    # Calculate averages
    processed["total_active_hours"] = sum(active_hours) if active_hours else 0
    processed["avg_screen_time"] = sum(screen_times)/len(screen_times) if screen_times else 0
    processed["devices"] = list(processed["devices"])
    
    # Sort and store top categories
    processed["app_categories"] = [item[0] for item in 
                                  sorted(category_counter.items(), 
                                         key=lambda x: x[1], reverse=True)[:5]]
    
    return processed


def _generate_insights(profile):
    """Generate cross-domain insights from consolidated data"""
    insights = {
        "activity_level": None,
        "primary_interests": [],
        "communication_patterns": {}
    }
    
    # Determine activity level
    social_activity = profile["social_media"]["total_posts"] + profile["social_media"]["total_likes"]
    email_activity = profile["email_interactions"]["total_interactions"]
    
    if social_activity > 1000 or email_activity > 50:
        insights["activity_level"] = "high"
    elif social_activity > 100 or email_activity > 10:
        insights["activity_level"] = "medium"
    else:
        insights["activity_level"] = "low"
    
    # Combine interests from different sources
    combined_interests = {}
    for interest in profile["social_media"]["combined_interests"]:
        combined_interests[interest] = combined_interests.get(interest, 0) + 3  # Higher weight for social
    
    for topic in profile["email_interactions"]["common_topics"]:
        combined_interests[topic] = combined_interests.get(topic, 0) + 1
    
    insights["primary_interests"] = [item[0] for item in 
                                   sorted(combined_interests.items(), 
                                          key=lambda x: x[1], reverse=True)[:5]]
    
    # Communication patterns
    insights["communication_patterns"] = {
        "primary_medium": "social" if social_activity > email_activity else "email",
        "recent_activity": max(
            profile["social_media"]["last_active"] or "",
            profile["email_interactions"]["last_contact_date"] or ""
        )
    }
    
    return insights
