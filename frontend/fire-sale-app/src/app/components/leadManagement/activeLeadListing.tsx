"use client";

import { useState, useEffect } from 'react';
import { serviceSuiteService } from '@/app/services/serviceSuiteService';

export default function ActiveLeadListing() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    // Load services on component mount
    useEffect(() => {
        const fetchActiveLeads = async () => {
        try {
            setLoading(true);
            const serviceList = await serviceSuiteService.listActiveLeads();
            setServices(serviceList);
        } catch (err) {
            setError('Failed to load services');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        fetchActiveLeads();
    }, []);


    const toggleRow = (index: number) => {
      const newExpandedRows = new Set(expandedRows);
      if (newExpandedRows.has(index)) {
        newExpandedRows.delete(index);
      } else {
        newExpandedRows.add(index);
      }
      setExpandedRows(newExpandedRows);
    };
  
      return (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Active Leads</h2>
          </div>
                    
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service, index) => (
                    
                        <tr 
                            key={index} 
                            className={`hover:bg-gray-50 cursor-pointer ${expandedRows.has(index) ? 'bg-gray-50' : ''}`}
                            onClick={() => toggleRow(index)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            4
                            </td>
                        </tr>

                        
                    ))}
                </tbody>
            </table>
          </div>
            
        </div>
      );
  }