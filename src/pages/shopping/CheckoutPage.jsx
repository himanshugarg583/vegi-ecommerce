import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Shield,
  Truck,
  Phone,
  Gift,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import ProductDetailLayout from "../../components/shopping/ProductDetailLayout";
import { clearSelectedProduct } from "../../store/slice/productsSlice";
import {
  removeItemFromCartAction,
  clearCartAction,
  updateQuantityAction,
  getCartAction,
} from "../../store/slice/cartSlice";
import { debounce } from "../../Utils/debounce";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [], isLoading } = useSelector((state) => state.cart || {});
  const selectedProduct = useSelector((state) => state.products.selectedProduct);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    deliveryInstructions: "",
    couponCode: "",
  });

  const steps = [
    { id: 1, name: "Shipping", icon: MapPin },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Review", icon: Check },
  ];

  // Debounced cart fetch
  const debouncedFetchCart = useMemo(
    () =>
      debounce(
        () =>
          (!cartItems || cartItems.length === 0) && dispatch(getCartAction()),
        500
      ),
    [dispatch, cartItems]
  );

  useEffect(() => {
    debouncedFetchCart();
  }, [debouncedFetchCart]);

  const subtotal = (Array.isArray(cartItems) ? cartItems : []).reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  );
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const discount = formData.couponCode === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee + tax - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const orderData = { customer: formData, items: cartItems, total };
      await dispatch(clearCartAction(orderData));
      toast.success("Order placed successfully! 🎉", { autoClose: 3000 });
      navigate("/");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  const applyCoupon = () => {
    if (formData.couponCode === "SAVE10") {
      toast.success("Coupon applied! 10% discount added", { autoClose: 2000 });
    } else {
      toast.error("Invalid coupon code", { autoClose: 2000 });
    }
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantityAction({ product: item.product, quantity: newQuantity }));
  };

  const handleRemoveItem = (item) => {
    dispatch(removeItemFromCartAction(item.product));
    toast.info("Item removed from cart");
  };

  const handleCloseDetail = () => dispatch(clearSelectedProduct());

  if (isLoading && isAuthenticated)
    return <div className="text-center py-20">Loading cart...</div>;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Gift className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-xl text-gray-600 mb-8">
            Add some items to your cart to proceed with checkout
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Cart</span>
          </button>
          <div className="flex items-center gap-2 md:mr-32">
            <Gift className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
          <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Steps */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          isCompleted
                            ? "bg-green-600 border-green-600 text-white"
                            : isActive
                            ? "border-green-600 text-green-600"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          isActive
                            ? "text-green-600"
                            : isCompleted
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-0.5 mx-2 ${
                            isCompleted ? "bg-green-600" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              {/* Shipping Step */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Shipping Information
                  </h2>
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
                  <input
                    type="text"
                    name="address"
                    placeholder="Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
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
                  <textarea
                    name="deliveryInstructions"
                    placeholder="Delivery Instructions (Optional)"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Payment Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {[
                      { method: "card", label: "Credit Card", Icon: CreditCard },
                      { method: "upi", label: "UPI", Icon: Phone },
                      { method: "cod", label: "Cash on Delivery", Icon: Truck },
                    ].map(({ method, label, Icon }) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, paymentMethod: method }))
                        }
                        className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                          formData.paymentMethod === method
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Icon className="h-8 w-8 mx-auto mb-2" />
                        <div className="font-medium">{label}</div>
                      </button>
                    ))}
                  </div>
                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="Card Number *"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="CVV"
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="Name on Card *"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <p className="mt-1 text-blue-600">
                      Your payment information is encrypted and secure. We never store your card
                      details.
                    </p>
                  </div>
                </div>
              )}

              {/* Review Step */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Review Your Order
                  </h2>

                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p>{formData.country}</p>
                      <p>Phone: {formData.phone}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Payment Method</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm">
                      <p className="capitalize">{formData.paymentMethod}</p>
                      {formData.paymentMethod === "card" && (
                        <>
                          <p>Card Holder: {formData.cardName}</p>
                          <p>Card Number: **** **** **** {formData.cardNumber.slice(-4)}</p>
                          <p>Expiry: {formData.expiryDate}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Order Items</h3>
                    {cartItems.map((item) => (
                      <div
                        key={item.product?._id}
                        className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 text-sm"
                      >
                        <img
                          src={item.product?.image}
                          alt={item.product?.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="truncate">{item.product?.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity - 1)
                              }
                              className="p-1 border rounded hover:bg-gray-200"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity + 1)
                              }
                              className="p-1 border rounded hover:bg-gray-200"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item)}
                              className="ml-2 p-1 border rounded hover:bg-red-200"
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <p>₹{((item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                )}
                {currentStep < 3 && (
                  <button
                    onClick={handleNext}
                    className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
                {currentStep === 3 && (
                  <button
                    onClick={handleSubmit}
                    className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-gray-900 font-semibold mb-2">Apply Coupon</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  placeholder="Coupon Code"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
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

export default CheckoutPage;