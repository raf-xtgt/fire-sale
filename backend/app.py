from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os
from werkzeug.middleware.proxy_fix import ProxyFix
# from agentController import AgentController
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from controller.sales_lead_controller import sales_lead_bp
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


load_dotenv()
print(fireSaleDb)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {  # This will apply to all routes
        "origins": "http://localhost:3000",
        "supports_credentials": True
    }
})
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
socketio = SocketIO(app, 
                   cors_allowed_origins="*",
                   async_mode='gevent',  # or 'eventlet' if you prefer
                   logger=True,
                   engineio_logger=True)

app.register_blueprint(sales_lead_bp, url_prefix='/api')
                
# Replace with your bot token and chat ID
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')
TELEGRAM_API_URL = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/'
SECRET_TOKEN = os.getenv("TELEGRAM_WEBHOOK_SECRET_TOKEN")
IBM_ACCESS_TOKEN = os.getenv("IBM_ACCESS_TOKEN")
IBM_CLOUD_URL = os.getenv("IBM_CLOUD_URL")
IBM_MODEL_ID = os.getenv("IBM_MODEL_ID")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID")

# Route to send a message to Telegram
@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    send_url = f'{TELEGRAM_API_URL}sendMessage'
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': message
    }

    response = requests.post(send_url, json=payload)
    if response.status_code == 200:
        return jsonify({'status': 'Message sent'}), 200
    else:
        return jsonify({'error': 'Failed to send message'}), 500

# Route to receive messages from Telegram (Webhook)
@app.route('/webhook', methods=['POST', 'GET'])
def webhook():
    if request.method == 'GET':
        return "Webhook is ready!", 200

    update = request.json
    # Telegram sends updates in this format
    if 'message' in update:
        message = update['message']
    elif 'edited_message' in update:
        message = update['edited_message']
    else:
        print("No message in update")
        return jsonify({'status': 'ok'}), 200
    
    text = message.get('text')
    
    # Broadcast the received message to all connected clients
    socketio.emit('new_message', {
        'text': text,
        'sender': 'them',
        'time': message.get('date', 'Now'),  # Use Telegram's date or 'Now'
        'chatId': str(message['chat']['id'])  # Assuming chat ID is available
    })

    # agent_controller = AgentController()
    response = "lolol" #agent_controller.get_response(text)
    print("ai response", str(response))
    
    socketio.emit('ai_response', {
        'response': response,
        'sender': 'ai',
        'time': message.get('date', 'Now'),  # Use Telegram's date or 'Now'
        'chatId': str(message['chat']['id'])  # Assuming chat ID is available
    })

    return jsonify({'status': 'ok', 'response': response}), 200

def performSentimentAnalysis(text):

    url = IBM_CLOUD_URL

    body = {
        "input": """Analyze the sentiment expressed in the following text related to logistics tracking software. Determine whether the sentiment is positive, negative, or neutral. Return only the sentiment.

    Input: Requested a replacement of the lithium batteries ten days ago, but have not received any response. Your team needs to closely communicate with us if we are to continue doing business.
    Output: Negative

    Input: I have tested the whole flow and so far seems to be ok.
    Output: Positive

    Input: Your system keeps on spamming the same email to the customer. Please fix this and ensure this doesn'\''t happen again.
    Output: Negative

    Input: We have tested the phase 2 of the automated processes. We would like to do a second round of testing next month before signing the UAT.
    Output: Neutral

    Input: I am receiving duplicate job orders on the system when I search by a job order number.
    Output:""",
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": 200,
            "min_new_tokens": 0,
            "repetition_penalty": 1
        },
        "model_id": IBM_MODEL_ID,
        "project_id":IBM_PROJECT_ID
    }

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer "+IBM_ACCESS_TOKEN
    }

    response = requests.post(
        url,
        headers=headers,
        json=body
    )

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    data = response.json()
    print("AI response", data)


@app.route('/test', methods=['POST'])
def test():
    print("Test received:", request.json)
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    socketio.run(app, port=5000, debug=True)