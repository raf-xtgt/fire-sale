import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { searchForSalesLeads } from '@/app/services/salesLeadService';
import SalesLeadListing from '../salesLead/salesLeadListing';
import { SalesLead } from '@/app/models/SalesLead';

const AdvancedSearch = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchData, setSearchData] = useState({
    searchQuery: '',
    orderNumber: '',
    shopifyOrderNumber: '',
    startDate: '17/01/2020',
    endDate: '29/01/2020',
    status: 'All',
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    destination: '',
    trackingNumber: '',
    transactionNumber: '',
    orderType: 'All',
    source: 'All',
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Search Data:', searchData);
    // Here you would typically send the data to an API
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await searchForSalesLeads(searchData.searchQuery);
      console.log("api response", result)
      if (result.error) {
        setError(result.error);
      } else {
        setLeads(result.data);
      }
    } catch (error) {
      setError('Failed to fetch sales leads. Please try again.');
      console.error('Error fetching sales leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6 flex items-center gap-2">
            <input
                type="text"
                name="searchQuery"
                value={searchData.searchQuery}
                onChange={handleChange}
                placeholder="Ask Me anything..."
                className="flex-1 p-4 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="button"
                onClick={() => setIsFormExpanded(!isFormExpanded)}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={isFormExpanded ? 'Collapse filters' : 'Expand filters'}
            >
                {isFormExpanded ? (
                <FiChevronUp size={24} />
                ) : (
                <FiChevronDown size={24} />
                )}
            </button>
        </div>
      
      <form onSubmit={handleSearch}>
        {isFormExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order#</label>
            <input
                type="text"
                name="orderNumber"
                value={searchData.orderNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shopify Order #</label>
            <input
                type="text"
                name="shopifyOrderNumber"
                value={searchData.shopifyOrderNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex space-x-2">
                <input
                type="text"
                name="startDate"
                value={searchData.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                />
                <span className="flex items-center">to</span>
                <input
                type="text"
                name="endDate"
                value={searchData.endDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
                name="status"
                value={searchData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
                type="text"
                name="firstName"
                value={searchData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
                type="text"
                name="lastName"
                value={searchData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
                type="text"
                name="company"
                value={searchData.company}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
                type="email"
                name="email"
                value={searchData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
                type="text"
                name="destination"
                value={searchData.destination}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking #</label>
            <input
                type="text"
                name="trackingNumber"
                value={searchData.trackingNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trans #</label>
            <input
                type="text"
                name="transactionNumber"
                value={searchData.transactionNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
            <select
                name="orderType"
                value={searchData.orderType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            >
                <option value="All">All</option>
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="International">International</option>
            </select>
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
                name="source"
                value={searchData.source}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
            >
                <option value="All">All</option>
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
                <option value="In-Store">In-Store</option>
            </select>
            </div>
            </div>
        )}
    
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </div>
      </form>

      { isLoading && (
        <div className='mt-6 text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'>
          </div>
          <p className="mt-2 text-gray-600">Searching for leads...</p>
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <SalesLeadListing leads={leads} />
      )}
    </div>
  );
};

export default AdvancedSearch;