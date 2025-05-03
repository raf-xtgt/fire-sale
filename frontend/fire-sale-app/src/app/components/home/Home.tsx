import CustomerListing from "../customer/customerListing";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Total Customers</h2>
          <p className="text-3xl">1,234</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Message Channels</h2>
          <p className="text-3xl">5</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">New Messages</h2>
          <p className="text-3xl">23</p>
        </div>
      </div>
      <div className="p-4">
        <CustomerListing />
      </div>
    </div>
  );
}