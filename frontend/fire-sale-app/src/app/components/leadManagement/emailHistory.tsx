"use client";
import { useState, useEffect } from 'react';
import { serviceSuiteService } from '@/app/services/serviceSuiteService';

interface EmailHistoryCardProps {
  service: any;
  onClose: () => void;
}

export default function EmailHistoryCard({ service, onClose }: EmailHistoryCardProps) {
    const [emailLeads, setEmailLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls in your implementation
  const emailHistory = [
    { id: 1, date: '2023-05-01', subject: 'Regarding your inquiry', content: 'Thank you for reaching out to us...' },
    { id: 2, date: '2023-05-02', subject: 'Follow up', content: 'Just checking if you had any questions...' },
  ];

    // Load services on component mount
    useEffect(() => {
        console.log("selected lead", service)
        const fetchActiveLeads = async () => {
        try {
            setLoading(true);
            const emailHistoryLeads = await serviceSuiteService.getMessagesByUserId(service.user_id);
            setEmailLeads(emailHistoryLeads);
        } catch (err) {
            setError('Failed to load services');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        fetchActiveLeads();
    }, []);


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Email History with {service.name}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {emailHistory.length > 0 ? (
          <div className="space-y-4">
            {emailLeads.map((email) => (
              <div key={email.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{email.email_subject}</h4>
                  <span className="text-sm text-gray-500">{email.email_time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{email.email_body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-8">No email history found</p>
        )}
      </div>
    </div>
  );
}