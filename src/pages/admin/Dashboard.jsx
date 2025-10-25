import {
  ChartLine,
  Eye,
  History,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import Filter from "../../components/admin/Filter";
import OrderDetailsModal from "../../components/admin/OrderDetailsModal"; // ✅ new component

const dashboardStats = [
  { title: "Total Sales", icon: <ChartLine />, data: "$ 50", bgColor: "bg-green-500" },
  { title: "Orders", icon: <ShoppingCart />, data: 50, bgColor: "bg-blue-500" },
  { title: "Customers", icon: <Users />, data: 50, bgColor: "bg-purple-500" },
  { title: "Products", icon: <Package2 />, data: 50, bgColor: "bg-orange-500" },
];

const sampleOrders = [...Array(8)].map((_, i) => ({
  id: `#${50 + i}`,
  name: "Aman Singh Bisht",
  email: "amansinghbisht@gmail.com",
  date: "Sep 23, 2025, 04:28 PM",
  items: 1,
  amount: "$500.00",
  payment: "Completed",
  status: "Pending",
}));
function Dashboard() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="w-full py-5  overflow-x-auto">
      <h1 className="sr-only">Store Dashboard</h1>

      {/* --- Stats Section --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((item, index) => (
          <div
            key={index}
            className="p-5 bg-white rounded-xl flex flex-col gap-3 shadow transition hover:shadow-lg"
          >
            <div
              className={`h-10 w-10 rounded-lg text-white grid place-content-center ${item.bgColor}`}
            >
              {item.icon}
            </div>
            <h2 className="text-2xl font-semibold">{item.data}</h2>
            <p className="text-sm text-zinc-400">{item.title}</p>
          </div>
        ))}
      </section>

      {/* --- Orders Section --- */}
      <section className="bg-white min-h-72 rounded-xl mt-10 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-blue-500">
                <History />
              </span>
              <h1 className="text-2xl font-semibold">Orders</h1>
              <span className="bg-blue-600 text-sm font-semibold text-white px-3 py-1 rounded-full">
                {sampleOrders.length}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track your customers
            </p>
          </div>
          <Filter />
        </div>

        {/* Search bar */}
        <div className="w-full mt-8">
          <div className="w-full p-3 px-5 rounded-lg bg-zinc-100 flex items-center gap-4 text-zinc-500">
            <Search />
            <input
              className="w-full bg-transparent outline-none text-sm"
              type="text"
              placeholder="Search Orders"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto mt-8 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100 truncate">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left font-semibold text-gray-700">
                  Order Id
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold text-gray-700">
                  Customer
                </th>
                <th className="hidden md:table-cell px-4 md:px-6 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
                <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left font-semibold text-gray-700">
                  Items
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold text-gray-700">
                  Amount
                </th>
                <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left font-semibold text-gray-700">
                  Payment
                </th>
                <th className="hidden lg:table-cell px-4 md:px-6 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleOrders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 font-semibold">{order.id}</td>
                  <td className="px-4 md:px-6 py-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{order.name}</h4>
                      <p className="text-gray-500 text-xs md:text-sm">{order.email}</p>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 md:px-6 py-4 text-gray-700">
                    {order.date}
                  </td>
                  <td className="hidden sm:table-cell px-4 md:px-6 py-4">
                    <span className="inline-block px-2 md:px-3 py-1 bg-blue-500 text-white font-semibold rounded-full text-xs md:text-sm">
                      {order.items}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-700">{order.amount}</td>
                  <td className="hidden sm:table-cell px-4 md:px-6 py-4">
                    <span className="px-2 md:px-3 py-1 bg-green-600 text-white font-semibold rounded-full text-xs md:text-sm">
                      {order.payment}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 md:px-6 py-4">
  <span
    className={`px-2 md:px-3 py-1 font-semibold rounded-full text-xs md:text-sm
      ${
        order.status === "Completed"
          ? "bg-green-100 text-green-700 border border-green-300"
          : order.status === "Pending"
          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
          : order.status === "Cancelled"
          ? "bg-red-100 text-red-700 border border-red-300"
          : "bg-gray-100 text-gray-600 border border-gray-300"
      }`}
  >
    {order.status}
  </span>
</td>

                  <td className="px-4 md:px-6 py-4">
                    <div
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 w-8 h-8 md:w-10 md:h-10 text-blue-500 bg-gray-200 rounded-lg cursor-pointer hover:bg-blue-100 flex items-center justify-center"
                    >
                      <Eye size={16} className="md:size-5" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Modal --- */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
