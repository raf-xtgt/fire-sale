// components/SalesLeadEmail.tsx
import React, { useState } from 'react';
import { SalesLead } from '@/app/models/SalesLead';
import { FaFacebook, FaTimes } from 'react-icons/fa';

interface SalesLeadEmailProps {
  lead: SalesLead;
  onClose: () => void;
}

const SalesLeadEmail: React.FC<SalesLeadEmailProps> = ({ lead, onClose }) => {
  const [formData, setFormData] = useState({
    from: 'sales@fireSale.com',
    to: lead.basic_info.email,
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email data:', formData);
    console.log("primary interests", lead.derived_insights.primary_interests)
    // Here you would typically send the email
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">New mail</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input 
                type="email" 
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input 
                type="email" 
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input 
              type="text" 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Type here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder="Write your message here..."
              required
            />
          </div>

          {lead.derived_insights?.primary_interests?.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Primary Interests</h4>
              <div className="flex flex-wrap gap-2">
                {lead.derived_insights.primary_interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button 
              type="button"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaFacebook className="mr-2" />
              Facebook
            </button>
            <div className="space-x-4">
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Generate template
              </button>
              
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            *For updates we have included what you will be targeting. Edit Register
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesLeadEmail;