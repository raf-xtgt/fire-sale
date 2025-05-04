import ActiveLeadListing from "./activeLeadListing";

export default function SalesLeads() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Leads Management</h1>
      <div className="p-4">
        <ActiveLeadListing />
      </div> 
    </div>
  );
}