// components/SalesLeadEmail.tsx
import React, { useState, useEffect } from 'react';
import { SalesLead } from '@/app/models/SalesLead';
import { FaTimes } from 'react-icons/fa';
import { generateSalesLeadEmail } from '@/app/services/salesLeadService';
import { motion } from 'framer-motion';
import { serviceSuiteService } from '@/app/services/serviceSuiteService';
import { v4 as uuidv4 } from 'uuid'
import { EmailHistory } from '@/app/models/emailHistory';
import { ServiceSuite } from '@/app/models/serviceSuite';

interface SalesLeadEmailProps {
  lead: SalesLead;
  onClose: () => void;
}

const SalesLeadEmail: React.FC<SalesLeadEmailProps> = ({ lead, onClose }) => {
  const [services, setServices] = useState<ServiceSuite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceSuite | null>(null);
  
  const [formData, setFormData] = useState({
    from: 'sales@fireSale.com',
    to: lead.basic_info.email,
    subject: '',
    message: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<{
    email_subject: string;
    email_body: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    // Load services on component mount
    useEffect(() => {
      const fetchServices = async () => {
        try {
          const serviceList = await serviceSuiteService.listServices();
          setServices(serviceList);
        } catch (err) {
          setError('Failed to load services');
          console.error(err);
        }
      };
      fetchServices();
    }, []);

    const handleServiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value;
      const service = services.find(s => s.suite_id === selectedId) || null;
      setSelectedService(service);
    };

  const handleGenerateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedEmail(null);
    
    try {
      console.log("service", selectedService)
      const payload = {
        "business_service_desc": selectedService?.service_desc || "",
        "audience_interests": lead.derived_insights.primary_interests 
      };
      
      // Simulate a small delay to show the animation
      const [response] = await Promise.all([
        generateSalesLeadEmail(payload),
        new Promise(resolve => setTimeout(resolve, 1500)) // Minimum 1.5s loading
      ]);
      
      setGeneratedEmail(response);
      
      setFormData(prev => ({
        ...prev,
        subject: response.email_subject,
        message: response.email_body
      }));
      
    } catch (error) {
      console.error('Error generating email template:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending email:', formData);
    // Here you would typically send the email
    // alert('Email sent successfully!');
    // onClose();
    console.log("Sales lead", lead)
    const createdService = await serviceSuiteService.markAsActiveConsumer(lead.basic_info.user_id, 'ACTIVE_SALES_LEAD');

    const emailHistory: EmailHistory = {
      guid: uuidv4(), // Generate a new GUID
      user_id: lead.basic_info.user_id,
      sender_email: formData.from,
      recipient_email: formData.to,
      email_direction: 'outbound',
      email_subject: formData.subject,
      email_body: formData.message,
      email_time: new Date().toISOString(), // Current timestamp
    };

    const emailHistoryService = await serviceSuiteService.createEmailHistory(emailHistory);
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
        
        <form onSubmit={handleSendEmail} className="space-y-4">
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
              className="w-full p-2 border border-gray-300 rounded-md h-56"
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

          {/* Service listing selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service For Context</label>
            <select
              value={selectedService?.suite_id || ''}
              onChange={handleServiceSelect}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a service...</option>
              {services.map((service) => (
                <option key={service.suite_id} value={service.suite_id}>
                  {service.name}
                </option>
              ))}
            </select>
            {/* {selectedService && (
              <p className="mt-1 text-xs text-gray-500">
                {selectedService.service_desc}
              </p>
            )} */}
          </div>

          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 font-medium"
              >
                Crafting your perfect email...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-gray-500 mt-2"
              >
                Analyzing {lead.basic_info.name}'s interests
              </motion.p>
            </motion.div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <div className="space-x-4">
              <button 
                type="button"
                onClick={handleGenerateTemplate}
                disabled={isGenerating}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? 'Generating...' : 'Generate template'}
              </button>
              
              <button 
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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