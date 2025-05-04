from ..agents import *

class AgentController():
    def __init__(self):
        self.sales_lead_email_agent = SalesLeadEmailAgent()
   
    
    def get_response(self, business_service_desc, audience_interests):
        # Get GuardAgent's response
        sales_lead_email_agent_resp = self.sales_lead_email_agent.get_response(business_service_desc, audience_interests)
        return sales_lead_email_agent_resp
        
