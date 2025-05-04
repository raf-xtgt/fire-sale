import { SendMessageResponse } from "../models/sendMessageResponse";

export const searchForSalesLeads = async (message: string): Promise<any> => {
    try {
      const response = await fetch('http://localhost:5000/api/search-sales-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: "include", // Only if your API requires credentials like cookies
        body: JSON.stringify({ message }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to send message' 
      };
    }
  };


  export const generateSalesLeadEmail = async (payload: any): Promise<any> => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-sales-lead-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: "include", // Only if your API requires credentials like cookies
        body: JSON.stringify({ payload }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to send message' 
      };
    }
  };