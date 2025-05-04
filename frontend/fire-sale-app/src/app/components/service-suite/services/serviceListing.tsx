"use client";

import { useState, useEffect } from 'react';
import AddCustomer from './addService';
import { serviceSuiteService } from '@/app/services/serviceSuiteService';
import { ServiceSuite } from '@/app/models/serviceSuite';

export default function ServiceListing() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [services, setServices] = useState<ServiceSuite[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    // Load services on component mount
    useEffect(() => {
        const fetchServices = async () => {
        try {
            setLoading(true);
            const serviceList = await serviceSuiteService.listServices();
            setServices(serviceList);
        } catch (err) {
            setError('Failed to load services');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        fetchServices();
    }, []);

    const handleAddService = async (newService: any) => {
        try {
        setLoading(true);
        const createdService = await serviceSuiteService.createServiceSuite(newService);
        
        // Update local state with the new customer
        setServices(prev => [...prev, createdService]);
        
        console.log('Service created successfully:', createdService);
        } catch (err) {
        setError('Failed to create service');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const toggleRow = (index: number) => {
      const newExpandedRows = new Set(expandedRows);
      if (newExpandedRows.has(index)) {
        newExpandedRows.delete(index);
      } else {
        newExpandedRows.add(index);
      }
      setExpandedRows(newExpandedRows);
    };

    const truncateDescription = (desc: string, length = 50) => {
      if (!desc) return '';
      return desc.length > length ? `${desc.substring(0, length)}...` : desc;
    };
  
      return (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">All Services</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              aria-label="Add customer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
                    
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service, index) => (
            <>
              <tr 
                key={index} 
                className={`hover:bg-gray-50 cursor-pointer ${expandedRows.has(index) ? 'bg-gray-50' : ''}`}
                onClick={() => toggleRow(index)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {service.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {expandedRows.has(index) ? (
                    <div className="whitespace-normal">
                      {service.service_desc}
                    </div>
                  ) : (
                    truncateDescription(service.service_desc)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${service.label === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {service.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(index);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    {expandedRows.has(index) ? 'Collapse' : 'Expand'}
                  </button>
                </td>
              </tr>
              {expandedRows.has(index) && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-4 whitespace-normal">
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Full Description</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{service.service_desc}</p>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing data 1 to 8 of 256K entries
          </div>
    
          <AddCustomer
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddService}
          />
        </div>
      );
  }