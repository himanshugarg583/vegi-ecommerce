import React, { useEffect, useState } from "react";
import { X, Mail, Calendar, DollarSign, ShoppingBag, ChevronDown } from "lucide-react";

function OrderDetailsModal({ order, onClose }) {
  const [status, setStatus] = useState(order.payment);
  const [showDropdown, setShowDropdown] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setShowDropdown(false);
  };

  const statusColors = {
    Completed: "bg-green-100 text-green-700 border-green-300",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Cancelled: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
          <p className="text-gray-500 text-sm mt-1">Order ID: {order.id}</p>
        </div>

        {/* Order Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="text-blue-500" />
            <div>
              <p className="font-medium text-gray-800">{order.name}</p>
              <p className="text-sm text-gray-500">{order.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-green-500" />
            <p className="text-gray-700 text-sm">{order.date}</p>
          </div>

          <div className="flex items-center gap-3">
            <ShoppingBag className="text-purple-500" />
            <p className="text-gray-700 text-sm">
              Items Ordered:{" "}
              <span className="font-semibold text-gray-900">{order.items}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="text-yellow-500" />
            <p className="text-gray-700 text-sm">
              Amount: <span className="font-semibold">{order.amount}</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-6 mb-4"></div>

        {/* Status Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Status
          </h3>

          <div className="relative">
            {/* Status Badge / Selector */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border ${statusColors[status]} font-semibold transition-all hover:brightness-95`}
            >
              <span>{status}</span>
              <ChevronDown
                className={`transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                {["Completed", "Pending", "Cancelled"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleStatusChange(opt)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-100 ${
                      status === opt ? "bg-gray-50 font-semibold" : ""
                    }`}
                  >
                    <span>{opt}</span>
                    <span
                      className={`h-3 w-3 rounded-full ${
                        opt === "Completed"
                          ? "bg-green-500"
                          : opt === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Done
          </button>
        </div>
      </div>

      {/* Simple fade-in animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default OrderDetailsModal;
