from flask import Blueprint, jsonify, request, Response
import json
from  ..service import *
from ..models import *
from .agentController import *

# Create a Blueprint for these routes
sales_lead_bp = Blueprint('fire_sale_bp', __name__)

@sales_lead_bp.route('/search-sales-leads', methods=['POST'])
def search_sales_lead():
    print("search for sales leads")
    data = request.json
    search_query = data.get('message')
    print("Search query:", search_query)
    keywords = extract_keywords(search_query)
    social_media_data_points = search_social_media_by_keywords(keywords, 700)
    consol_profiles = []
    for uId in social_media_data_points:
        # print(uId)
        user_profile = get_user_from_id(uId)
        # print(user_profile)
        # print("\n")
        if user_profile is not None:
            social_media_docs = get_social_media_docs(uId)
            # print(social_media_docs)
            # print("\n")
            comm_docs = get_communication_docs(uId)
            # print(comm_docs)
            # print("\n")
            behavioral_docs = get_behavioral_metadata_docs(uId)
            # print(behavioral_docs)
            # print("\n")
            consolidated_profile_doc = construct_consolidated_profile(user_profile, social_media_docs, comm_docs, behavioral_docs)
            # print(consolidated_profile_doc)
            # print("\n")
            consol_profiles.append(consolidated_profile_doc)
    
    similarity_df = compute_similarity_matrix(consol_profiles)
    top_5_profiles = get_top_k_similar_profiles(similarity_df, consol_profiles, k=5)
    # print(top_5_profiles)
    unique_profiles = list({profile["basic_info"]["user_id"]: profile for profile in top_5_profiles}.values())
    # Display basic info for verification
    for profile in top_5_profiles:
        print(profile["basic_info"]["user_id"], "-", profile["basic_info"]["name"])

    # random_doc = random.choice(unique_profiles)
    # print(json.dumps(random_doc, indent=2))
    # print(type(random_doc["derived_insights"]["primary_interests"]))
    # serializable_profiles = [convert_to_serializable(profile) for profile in unique_profiles]
    # resp = {"leads": unique_profiles}
    # response_data = json.dumps({"data": str(unique_profiles)}, default=str)
    # print(response_data)
    # resp = str(top_5_profiles)
    # print(unique_profiles)
    return jsonify({"data": unique_profiles}), 200

    # return Response(response=response_data, status=200, mimetype='application/json')


@sales_lead_bp.route('/hello', methods=['POST'])
def hello_world():
    print("hello from fire sale")
    return jsonify({"message": "Hello, world! from fire sale"}), 200

# You can add more routes to this file
@sales_lead_bp.route('/greet', methods=['POST'])
def greet():
    return jsonify({"message": "Greetings from the modular route!"}), 200


@sales_lead_bp.route('/generate-sales-lead-email', methods=['POST'])
def generate_sale_lead_email():
    data = request.json
    print(data['payload'])
    b_desc = data['payload']['business_service_desc']
    p_interests = data['payload']['audience_interests']
    agent_controller = AgentController()
    response = agent_controller.get_response(b_desc, p_interests)
    return response, 200