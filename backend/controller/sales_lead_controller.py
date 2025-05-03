# routes/example_routes.py
from flask import Blueprint, jsonify

# Create a Blueprint for these routes
sales_lead_bp = Blueprint('fire_sale_bp', __name__)

@sales_lead_bp.route('/hello', methods=['POST'])
def hello_world():
    print("hello from fire sale")
    return jsonify({"message": "Hello, world! from fire sale"}), 200

# You can add more routes to this file
@sales_lead_bp.route('/greet', methods=['POST'])
def greet():
    return jsonify({"message": "Greetings from the modular route!"}), 200