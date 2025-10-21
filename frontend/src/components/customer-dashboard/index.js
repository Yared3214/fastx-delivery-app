import React from "react";

export default function CustomerDashboard() {
  const deliveries = [
    { id: "#FX12345", date: "Oct 18", status: "Delivered", total: "$29.99" },
    { id: "#FX12344", date: "Oct 14", status: "Cancelled", total: "$0.00" },
    { id: "#FX12343", date: "Oct 13", status: "Delivered", total: "$45.00" },
  ];
  

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, Sarah 👋
        </h1>
        <span className="text-gray-500 text-sm">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Active Deliveries" value="1" color="blue" />
        <SummaryCard label="Completed Deliveries" value="23" color="green" />
        <SummaryCard label="Avg. Delivery Time" value="38 mins" color="yellow" />
        <SummaryCard label="Satisfaction Score" value="4.8 ★" color="purple" />
      </div>

      {/* Active Delivery */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Active Delivery
        </h2>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Order ID: <span className="font-medium text-gray-700">#FX12456</span>
            </p>
            <p className="text-lg font-semibold mt-1 text-black">
              Status: <span className="text-blue-600">Out for Delivery</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ETA: <span className="font-medium text-gray-700">12 mins</span>
            </p>
            <div className="mt-3 text-sm text-gray-600">
              <p className="text-gray-600">Driver: <span className="font-medium">Alex Johnson</span></p>
              <p className="text-gray-600">Vehicle: <span className="font-medium">Yamaha Scooter (AB1234)</span></p>
            </div>
          </div>
          <button className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
            Track Delivery
          </button>
        </div>
      </div>

      {/* Recent Deliveries Table */}
      <div className="bg-white rounded-2xl shadow p-5 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Recent Deliveries
        </h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Total</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="py-2 text-black">{d.id}</td>
                <td className="text-black">{d.date}</td>
                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      d.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : d.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="text-black">{d.total}</td>
                <td>
                  <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Support Section */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Need Help?
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="text-black px-4 py-2 border rounded-lg hover:bg-gray-100">
            Report an Issue
          </button>
          <button className="text-black px-4 py-2 border rounded-lg hover:bg-gray-100">
            Contact Support
          </button>
          <button className="text-black px-4 py-2 border rounded-lg hover:bg-gray-100">
            FAQs
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
  }[color];

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-start">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-semibold mt-1 ${colorClasses}`}>{value}</p>
    </div>
  );
}
