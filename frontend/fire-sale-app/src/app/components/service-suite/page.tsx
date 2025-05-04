import ServiceListing from "./services/serviceListing";

export default function ServiceSuite() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Service Suite Management</h1>
      <div className="p-4">
        <ServiceListing />
      </div> 
    </div>
  );
}