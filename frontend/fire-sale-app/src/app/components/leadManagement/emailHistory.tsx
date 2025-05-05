"use client";
import { useState, useEffect } from 'react';
import { serviceSuiteService } from '@/app/services/serviceSuiteService';
import { FaReply } from 'react-icons/fa';
import FollowUpLeadEmail from './followUpLeadEmail';

interface EmailHistoryCardProps {
  service: any;
  onClose: () => void;
}

export default function EmailHistoryCard({ service, onClose }: EmailHistoryCardProps) {
    const [emailLeads, setEmailLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

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

    const handleFollowUp = (email: any) => {
        setSelectedEmail(email);
        setShowFollowUp(true);
    };

    const handleCloseFollowUp = () => {
        setShowFollowUp(false);
        setSelectedEmail(null);
    };

    return (
        <>
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
                    {emailLeads.length > 0 ? (
                        <div className="space-y-4">
                            {emailLeads.map((email) => (
                                <div key={email.id} className="border-b pb-4 last:border-b-0 group">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium">{email.email_subject}</h4>
                                        <span className="text-sm text-gray-500">{email.email_time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{email.email_body}</p>
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            onClick={() => handleFollowUp(email)}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaReply size={12} /> Follow-Up
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center mt-8">No email history found</p>
                    )}
                </div>
            </div>

            {showFollowUp && selectedEmail && (
                <FollowUpLeadEmail 
                    lead={service} 
                    onClose={handleCloseFollowUp}
                    previousEmail={selectedEmail}
                />
            )}
        </>
    );
}