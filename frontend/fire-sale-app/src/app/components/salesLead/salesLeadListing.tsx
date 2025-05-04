// components/SalesLeadListing.tsx
import React from 'react';
import { SalesLead } from '@/app/models/SalesLead';


interface SalesLeadListingProps {
  leads: SalesLead[];
}

const SalesLeadListing: React.FC<SalesLeadListingProps> = ({ leads }) => {


  // Dummy interests from your image
  const dummyInterests = [
    'Event Planning',
    'Catering',
    'Health & Safety',
    'Government Sponsors',
    'Online Retail Store',
    'Plumbing',
    'Investment Services'
  ];

  if (!leads || leads.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {/* No sales leads found. Try a different search. */}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {leads.map((lead) => {
        // Use actual interests if available, otherwise use a random selection of dummy interests
        const interestsToShow = lead.derived_insights.primary_interests?.length > 0
          ? lead.derived_insights.primary_interests
          : getRandomInterests(dummyInterests, 3); // Show 3 random dummy interests

        return (
          <div key={lead.basic_info.user_id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{lead.basic_info.name}</h3>
                <p className="text-sm text-gray-500">{lead.basic_info.email}</p>
                {lead.basic_info.phone && (
                  <p className="text-sm text-gray-500 mt-1">{lead.basic_info.phone}</p>
                )}
              </div>
            </div>
            
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Primary Interests</h4>
              <div className="flex flex-wrap gap-2">
                {interestsToShow.map((interest, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to get random interests
function getRandomInterests(interests: string[], count: number): string[] {
  const shuffled = [...interests].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


export default SalesLeadListing;