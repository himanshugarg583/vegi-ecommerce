import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  deleteAddress,
  clearUserMessages,
} from "../../Store/slice/userSlice";
import { clearSelectedProduct } from "../../Store/slice/productsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  MapPin,
  ShoppingCart,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Edit3,
  Package,
} from "lucide-react";
import Products from "./Products";
import ProductDetailLayout from "../../components/shopping/ProductDetailLayout";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetails, savedAddresses, isLoading, successMessage, error } = useSelector(
    (state) => state.user
  );
  const selectedProduct = useSelector((state) => state.products.selectedProduct);
  const handleCloseDetail = () => dispatch(clearSelectedProduct());
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [orders, setOrders] = useState([
    { id: "1001", date: "2025-10-01", total: "$120", status: "Delivered" },
    { id: "1002", date: "2025-09-21", total: "$89", status: "Processing" },
  ]);

  // Address form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryInstructions: "",
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userDetails) {
      setProfileData({ name: userDetails.name || "", email: userDetails.email || "" });
    }
  }, [userDetails]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearUserMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearUserMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleProfileUpdate = () => {
    dispatch(updateUserProfile(profileData));
  };

  const handlePasswordChange = () => {
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    dispatch(changePassword(passwords));
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddAddress = () => {
    const { firstName, lastName, address, city, state, zipCode, phone } = formData;
    if (!firstName || !lastName || !address || !city || !state || !zipCode || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    dispatch(addAddress(formData));
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      deliveryInstructions: "",
    });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-2 md:mr-32">
            <User className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {["Account Info", "Addresses", "Change Password"].map((label, idx) => {
            const step = idx + 1;
            return (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep === step
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {step}
                </div>
                <p
                  className={`mt-2 text-sm font-medium ${
                    currentStep === step ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Step 1: User Info + Orders */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Account Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-green-600" /> Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={profileData.email}
                  disabled
                  className="px-4 py-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <button
                onClick={handleProfileUpdate}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Orders Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" /> Recent Orders
              </h2>
              {orders.length === 0 ? (
                <p className="text-gray-500">No recent orders.</p>
              ) : (
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order.id} className="py-3 flex justify-between text-gray-700">
                      <p>
                        <span className="font-semibold">Order #{order.id}</span> –{" "}
                        {order.date}
                      </p>
                      <p className="text-right">
                        <span className="font-medium">{order.total}</span>{" "}
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Address Section */}
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" /> Saved Addresses
            </h2>

            {/* Saved Addresses */}
            <div className="space-y-3">
              {savedAddresses.length === 0 ? (
                <p className="text-gray-500">No saved addresses yet.</p>
              ) : (
                savedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {addr.firstName} {addr.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                      <p className="text-sm text-gray-500">
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                      <p className="text-sm text-gray-500">📞 {addr.phone}</p>
                    </div>
                    <button
                      onClick={() => dispatch(deleteAddress(addr._id))}
                      className="p-2 rounded hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* New Address Form */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Address Details
              </h2>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Address Field */}
              <input
                type="text"
                name="address"
                placeholder="Address *"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code *"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Delivery Instructions */}
              <textarea
                name="deliveryInstructions"
                placeholder="Additional Notes (Optional)"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <button
                onClick={handleAddAddress}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4" /> Add Address
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Change Password */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" /> Change Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {isLoading ? "Updating..." : "Change Password"}
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
      

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailLayout
          product={selectedProduct}
          onClose={handleCloseDetail}
          onAddToCart={() => toast.success("Item added to cart")}
        />
      )}
    </div>
  );
};

export default ProfilePage;
