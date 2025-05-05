// components/SalesLeadListing.tsx
import React, { useState } from 'react';
import { SalesLead } from '@/app/models/SalesLead';
import { FaEnvelope, FaComments } from 'react-icons/fa';
import SalesLeadEmail from './salesLeadEmail';

interface SalesLeadListingProps {
  leads: SalesLead[];
}

const SalesLeadListing: React.FC<SalesLeadListingProps> = ({ leads }) => {
  const [selectedLead, setSelectedLead] = useState<SalesLead | null>(null);
  const [showEmailUI, setShowEmailUI] = useState(false);

  // Dummy interests 
  const dummyInterests = ['event planning', 'catering',  'government sponsors', 'public gathering', 'parties', 'conferences'];
  // const dummyInterests = ['event planning', 'catering', 'health & safety', 'government sponsors', 'online retail store', 'plumbing', 'investment services', 'medical equipment', 'first aid kit'];

  const handleReachOut = (lead: SalesLead) => {
    // Create a copy of the lead to modify
    const leadWithInterests = { ...lead };
    
    // If primary interests is empty or doesn't exist, set random dummy interests
    if (!leadWithInterests.derived_insights?.primary_interests || 
        leadWithInterests.derived_insights.primary_interests.length === 0) {
      leadWithInterests.derived_insights = {
        ...leadWithInterests.derived_insights,
        primary_interests: getRandomInterests(dummyInterests, 3) // Get 3 random interests
      };
    }
    
    setSelectedLead(leadWithInterests);
    setShowEmailUI(true);
    console.log('Reaching out to lead:', leadWithInterests);
    console.log('Lead interests:', leadWithInterests.derived_insights.primary_interests);
  };

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
              <button
                onClick={() => handleReachOut(lead)}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaEnvelope className="mr-2" />
                Reach out
              </button>
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

      {showEmailUI && selectedLead && (
        <SalesLeadEmail 
          lead={selectedLead} 
          onClose={() => setShowEmailUI(false)} 
        />
      )}
    </div>
  );
};

// Helper function to get random interests
function getRandomInterests(interests: string[], count: number): string[] {
  const shuffled = [...interests].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default SalesLeadListing;