import CustomerListing from "../customer/customerListing";
import AdvancedSearch from "../advancedSearch/AdvancedSearch";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search For Sales Leads</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Active Customers</h2>
          <p className="text-3xl">36</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Active Leads</h2>
          <p className="text-3xl">24</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">New Messages</h2>
          <p className="text-3xl">12</p>
        </div>
      </div> */}
      {/* <div className="p-4">
        <CustomerListing />
      </div> */}
      <div className="p-4">
        <AdvancedSearch />
      </div>
    </div>
  );
}