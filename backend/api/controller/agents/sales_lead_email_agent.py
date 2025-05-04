import requests
from dotenv import load_dotenv
import os
from .utils import constructBody, getResponse
from copy import deepcopy
import re
import json

load_dotenv()
class SalesLeadEmail():
    def __init__(self):
        self.ibm_access_token =  os.getenv("IBM_ACCESS_TOKEN")
        self.ibm_cloud_url =  os.getenv("IBM_CLOUD_URL")
        self.ibm_model_id =  os.getenv("IBM_MODEL_ID")
        self.ibm_project_id =  os.getenv("IBM_PROJECT_ID")

        
    
    def get_response(self,messages):
        print("getting response from emai agent")
        messages = deepcopy(messages)
        url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
        body = {
            "input": """You are a professional marketing copywriter.
                Using the following context, generate a compelling and persuasive marketing email template designed to drive sales.
                The email should highlight the benefits of the services provided, speak directly to the interests and needs of the target audience, and include a clear call to action that encourages immediate engagement.

                You will be given the following as input:

                business service description: \"this will be a description of the business service\"

                interests of the target audience: \"a comma separated list of interests\"

                You need to strictly follow these requirements while writing the email:

                - Use a friendly yet professional tone.
                - Focus on benefits over features.
                - Keep the email concise (max 250 words).
                - Include a subject line and a compelling opening line.
                - Include a call to action (e.g., “Schedule a demo”, “Start your free trial”, “Talk to a consultant”).
                - End with a warm closing and contact details placeholder.

                The final output needs to be structured as follows:
                subject: This is the email subject.
                body: This is the email body.



                Details business service description: FastCatering is a full-service event planning small and medium enterprise (SME) dedicated to designing, coordinating, and executing exceptional events tailored to the unique needs of our clients. We specialize in a wide range of events including corporate functions, weddings, private parties, product launches, and community gatherings.

                interests of the target audience: professional parties, government sponsorships.
                Email subject: Make Your Next Event Unforgettable — Without the Stress

                body:
                Planning a professional gathering or government-sponsored event? Let FastCatering make it seamless and spectacular.

                At FastCatering, we specialize in creating memorable experiences tailored to your exact needs — whether it’s a high-profile corporate function, a polished product launch, or an elegant community reception. Our full-service team takes care of every detail so you can focus on what matters most: your guests, your message, and your success.

                We understand the importance of professionalism, timeliness, and presentation — especially when your reputation is on the line. With FastCatering, you gain a trusted partner who knows how to deliver polished, crowd-pleasing events that impress stakeholders and satisfy every expectation.

                Let’s bring your next event to life with style, precision, and ease.

                Talk to a consultant today and discover how we can help you elevate your next event from concept to applause.

                Warm regards,
                FastCatering Events Team
                events@fastCatering.com

                Details business service description: EventMakers is a dynamic small-to-medium enterprise (SME) specializing in the planning, organization, and execution of public events that inspire, engage, and bring communities together. With a passionate team of event professionals, we design and deliver a wide range of experiences including festivals, cultural celebrations, public exhibitions, community fairs, concerts, sporting events, and civic ceremonies..

                interests of the target audience: festivals, concerts.
                Email""",
                "parameters": {
                    "decoding_method": "sample",
                    "max_new_tokens": 200,
                    "min_new_tokens": 50,
                    "random_seed": 111,
                    "temperature": 0.8,
                    "top_k": 50,
                    "top_p": 1,
                    "repetition_penalty": 2
                },
                "model_id": self.ibm_model_id,
                "project_id": self.ibm_project_id
            }


        ai_response = getResponse(body, url, self.ibm_access_token)
        print(ai_response)
        sanitized_json = self.process_response(ai_response)        
        return sanitized_json

    def process_response(self, response_json):
        generated_text = response_json.get("results", [{}])[0].get("generated_text", "")
        
        # Regular expressions to extract decision and sentiment
        decision_match = re.search(r'"decision"\s*:\s*"(.*?)"', generated_text)
        sentiment_match = re.search(r'"sentiment"\s*:\s*"(.*?)"', generated_text)
        
        extracted_data = {
            "decision": decision_match.group(1) if decision_match else "not allowed",
            "sentiment": sentiment_match.group(1) if sentiment_match else "unknown"
        }
        
        return extracted_data  # Return dictionary instead of JSON string