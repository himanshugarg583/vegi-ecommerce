import React, { useState } from "react";
import { X, MapPin, Phone, User, Mail, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import WHATSAPP_CONFIG from "../../config/whatsappConfig";

const CheckoutPopup = ({ isOpen, onClose, cartItems, total }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderMessage = () => {
    let message = `🛒 *New Order Request*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    if (formData.email) message += `Email: ${formData.email}\n`;
    message += `\n📍 *Delivery Address:*\n`;
    message += `${formData.address}\n`;
    message += `${formData.city}, ${formData.state} - ${formData.pincode}\n`;
    
    if (formData.notes) {
      message += `\n📝 *Notes:* ${formData.notes}\n`;
    }

    message += `\n🛍️ *Order Items:*\n`;
    cartItems.forEach((item, index) => {
      const itemTotal = (item.product?.price || 0) * (item.quantity || 0);
      message += `${index + 1}. ${item.product?.title || "Product"}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.product?.price || 0} = ₹${itemTotal.toFixed(2)}\n`;
    });

    message += `\n💰 *Order Summary:*\n`;
    const subtotal = cartItems.reduce(
      (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
      0
    );
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.05;
    const totalAmount = subtotal + deliveryFee + tax;

    message += `Subtotal: ₹${subtotal.toFixed(2)}\n`;
    message += `Delivery: ₹${deliveryFee.toFixed(2)}\n`;
    message += `Tax (5%): ₹${tax.toFixed(2)}\n`;
    message += `*Total: ₹${totalAmount.toFixed(2)}*\n`;

    return message;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Generate WhatsApp message
    const message = generateOrderMessage();
    
    // Get WhatsApp number from config
    const whatsappNumber = WHATSAPP_CONFIG.phoneNumber;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    toast.success("Redirecting to WhatsApp...");
    
    // Close popup after a short delay
    setTimeout(() => {
      onClose();
      // Optionally clear form
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        notes: "",
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Complete Your Order</h2>
          <p className="text-green-50 text-sm mt-1">
            Fill in your details to place order via WhatsApp
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Delivery Address
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Flat No., Street, Area, Landmark"
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.pincode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MessageSquare className="inline h-4 w-4 mr-1 text-green-600" />
              Special Instructions (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special delivery instructions or notes..."
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({cartItems?.length || 0})</span>
                <span className="font-medium">
                  ₹
                  {(
                    cartItems?.reduce(
                      (acc, item) =>
                        acc + (item.product?.price || 0) * (item.quantity || 0),
                      0
                    ) || 0
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  ₹
                  {(cartItems?.reduce(
                      (acc, item) =>
                        acc + (item.product?.price || 0) * (item.quantity || 0),
                      0
                    ) || 0) > 500
                    ? "0.00"
                    : "50.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-medium">
                  ₹
                  {(
                    ((cartItems?.reduce(
                      (acc, item) =>
                        acc + (item.product?.price || 0) * (item.quantity || 0),
                      0
                    ) || 0) *
                      0.05)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">₹{total?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            Send Order via WhatsApp
          </button>

          <p className="text-xs text-gray-500 text-center">
            You'll be redirected to WhatsApp to confirm your order
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPopup;
