// components/SalesLeadEmail.tsx
import React from 'react';
import { SalesLead } from '@/app/models/SalesLead';
import { FaFacebook, FaTimes } from 'react-icons/fa';

interface SalesLeadEmailProps {
  lead: SalesLead;
  onClose: () => void;
}

const SalesLeadEmail: React.FC<SalesLeadEmailProps> = ({ lead, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">New mail</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="sales@fire-sale.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="More Sales"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Type here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder="Write your message here..."
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button className="flex items-center text-blue-600 hover:text-blue-800">
              <FaFacebook className="mr-2" />
              Facebook
            </button>
            <div className="space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Discard
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Next search
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            *For updates we have included what you will be targeting. Edit Register
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesLeadEmail;