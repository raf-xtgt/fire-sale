import requests
from dotenv import load_dotenv
import os
from copy import deepcopy
import re
import json
from ..service import *

load_dotenv()
class SalesLeadEmailAgent():
    def __init__(self):
        self.ibm_access_token =  os.getenv("IBM_ACCESS_TOKEN")
        self.ibm_cloud_url =  os.getenv("IBM_CLOUD_URL")
        self.ibm_model_id =  os.getenv("IBM_MODEL_ID")
        self.ibm_project_id =  os.getenv("IBM_PROJECT_ID")

        
    
    def get_response(self, business_service_desc, audience_interests):
        print("getting response from emai agent")
        url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
        interests_string = ', '.join(audience_interests)

        prompt = f"""You are a professional marketing copywriter.
                Using the following context, generate a compelling and persuasive marketing email template designed to drive sales.
                The email should highlight the benefits of the services provided, speak directly to the relevant interests and needs of the target audience, and include a clear call to action that encourages immediate engagement.

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
                - The business service description may not be provided, so instead only make use of the interests of the target audience.
                - The email subject and body must be clearly distinct. No details or information in the subject should remain in the email body.
                - If there is an interest in the target audience that is different from the service description then you can ignore that specific interest only.

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

                Details business service description: {business_service_desc}
                interests of the target audience: { interests_string }.

                Email"""
        
        body = {
            "input": prompt,
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
                "model_id":  "ibm/granite-3-2-8b-instruct",
                "project_id": self.ibm_project_id
            }


        ai_response = getResponse(body, url, self.ibm_access_token)
        print("ai response: ")
        sanitized_json = self.extract_email_data(ai_response)        
        print(sanitized_json)
        return sanitized_json


    def extract_email_data(self, inference_output):
        try:
            # Extract the generated text
            generated_text = inference_output['results'][0]['generated_text']
            
            # Split into subject and body sections
            subject_section, body_section = generated_text.split("Body", 1)
            
            # Extract subject line (remove "Subject Line Example" and any extra whitespace/formatting)
            subject = subject_section.replace("Subject:", "").strip()
            subject = subject.replace("\n", "").strip()
            subject = ' '.join(subject.split())  # Normalize whitespace
            
            # Clean up the body section
            body = body_section.strip()
            body = '\n'.join(line.strip() for line in body.split('\n') if line.strip())
            
            # Create result dictionary
            result = {
                "email_subject": subject,
                "email_body": body
            }
            
            return json.dumps(result, indent=2)
        
        except Exception as e:
            return json.dumps({"error": str(e)})
