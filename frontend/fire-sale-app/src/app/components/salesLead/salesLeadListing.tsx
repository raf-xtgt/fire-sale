// components/SalesLeadListing.tsx
import React, { useState } from 'react';
import { SalesLead } from '@/app/models/SalesLead';
import { FaPaperPlane, FaTimes, FaFacebook, FaSearch } from 'react-icons/fa';

interface SalesLeadListingProps {
  leads: SalesLead[];
}

const SalesLeadListing: React.FC<SalesLeadListingProps> = ({ leads }) => {
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: ''
  });
  const [selectedLead, setSelectedLead] = useState<SalesLead | null>(null);

  // Dummy interests from your image
  const dummyInterests = ['event planning', 'catering', 'health & safety', 'government sponsors', 'online retail store', 'plumbing', 'investment services', 'medical equipment', 'first aid kit'];

  const handleReachOut = (lead: SalesLead) => {
    setSelectedLead(lead);
    setActiveEmail(lead.basic_info.email);
    setEmailContent({
      subject: `Regarding your interest in ${lead.derived_insights.primary_interests?.[0] || 'our services'}`,
      body: ''
    });
  };

  const handleEmailSubmit = () => {
    // Here you would typically send the email via an API
    console.log('Email sent to:', activeEmail);
    console.log('Subject:', emailContent.subject);
    console.log('Body:', emailContent.body);
    setActiveEmail(null);
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {/* No sales leads found. Try a different search. */}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 mt-6 space-y-4">
        {leads.map((lead) => {
          const interestsToShow = lead.derived_insights.primary_interests?.length > 0
            ? lead.derived_insights.primary_interests
            : getRandomInterests(dummyInterests, 3);

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
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaPaperPlane className="mr-2" />
                  Reach Out
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
      </div>

      {/* Email UI Panel */}
      {activeEmail && (
        <div className="md:w-1/2 bg-white p-4 border border-gray-200 rounded-lg shadow-sm mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">New Email</h3>
            <button 
              onClick={() => setActiveEmail(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Firm:</span>
              <span className="text-sm">Just Mail (ref)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Submissioner:</span>
              <span className="text-sm">More Sales</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={emailContent.subject}
                onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Type here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={emailContent.body}
                onChange={(e) => setEmailContent({...emailContent, body: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md h-40"
                placeholder="Write your message here..."
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <FaSearch />
                </button>
                <button className="p-2 text-blue-500 hover:text-blue-700">
                  <FaFacebook />
                </button>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                  Discard
                </button>
                <button 
                  onClick={handleEmailSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  Next search <FaPaperPlane className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getRandomInterests(interests: string[], count: number): string[] {
  const shuffled = [...interests].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default SalesLeadListing;