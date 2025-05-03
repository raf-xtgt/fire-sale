export interface SalesLead {
    basic_info: {
      user_id: string;
      name: string;
      email: string;
      phone?: string;
    };
    derived_insights: {
      primary_interests: string[];
    };
}