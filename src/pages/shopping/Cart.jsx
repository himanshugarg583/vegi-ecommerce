import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";

import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

import {
  removeItemFromCartAction,
  clearCartAction,
  updateQuantityAction,
  getCartAction,
  addItemToCartAction,
} from "../../store/slice/cartSlice";

import { debounce } from "../../Utils/debounce";
import ProductDetailLayout from "../../components/shopping/ProductDetailLayout";
import { clearSelectedProduct } from "../../store/slice/productsSlice";
import CheckoutPopup from "../../components/shopping/CheckoutPopup";

const Cart = ({ openCheckoutPopup = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems = [], isLoading } = useSelector((state) => state.cart || {});
  const selectedProduct = useSelector(
    (state) => state.products.selectedProduct
  );
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [savedItems, setSavedItems] = useState([]);
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(openCheckoutPopup);

  // Debounced cart fetch
  const debouncedFetchCart = useMemo(
    () => debounce(() => (!cartItems || cartItems.length === 0) && dispatch(getCartAction()), 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetchCart();
  }, [debouncedFetchCart]);

  // Auto-open checkout popup if coming from /checkout route
  useEffect(() => {
    if (openCheckoutPopup && cartItems.length > 0) {
      setShowCheckoutPopup(true);
    }
  }, [openCheckoutPopup, cartItems]);

  // Cart totals
  const subtotal = (Array.isArray(cartItems) ? cartItems : []).reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  const deliveryFee = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  // Quantity handler
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantityAction({ product: item.product, quantity: newQuantity }));
  };

  // Remove item
  const handleRemoveItem = (item) => {
    dispatch(removeItemFromCartAction(item.product));
  };

  // Save for later
  const handleSaveForLater = (item) => {
    setSavedItems((prev) => [...prev, item]);
    dispatch(removeItemFromCartAction(item.product));
    toast.info("Item saved for later", { autoClose: 1500 });
  };

  // Move back to cart
  const handleMoveToCart = (item) => {
    dispatch(addItemToCartAction({ product: item.product, quantity: item.quantity || 1 }));
    setSavedItems((prev) => prev.filter((i) => i.product?._id !== item.product?._id));
  };

  // Clear entire cart
  const handleClearCart = () => {
    dispatch(clearCartAction());
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowCheckoutPopup(true);
  };

  const handleCloseDetail = () => dispatch(clearSelectedProduct());

  if (isLoading && isAuthenticated) return <Loader message="Loading cart items..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Continue Shopping</span>
          </button>

          <div className="flex items-center gap-2 mr-36">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          <div className="text-sm text-gray-500">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.slice().reverse().map((item) => (
                    <div
                      key={item.product?._id}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative">
                          <img
                            src={item.product?.image}
                            alt={item.product?.title}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm"
                          />
                          {item.product?.offer && (
                            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {item.product.offer}% OFF
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-md sm:text-lg font-semibold text-gray-900 mb-1">
                            {item.product?.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.product?.category}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg sm:text-xl font-bold text-green-600">
                              ₹{(item.product?.price || 0).toFixed(2)}
                            </span>
                            {item.product?.originalPrice &&
                              item.product.originalPrice > item.product.price && (
                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                  ₹{item.product.originalPrice.toFixed(2)}
                                </span>
                              )}
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors duration-200"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              ₹{((item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                          >
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">Save</span>
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Saved for Later</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {savedItems.map((item) => (
                      <div
                        key={item.product?._id}
                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <img
                            src={item.product?.image}
                            alt={item.product?.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {item.product?.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.product?.category}
                            </p>
                            <div className="text-lg font-bold text-green-600">
                              ₹{(item.product?.price || 0).toFixed(2)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 mt-2 sm:mt-0"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 text-sm sm:text-base">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-semibold" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  {deliveryFee === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700 text-xs sm:text-sm">
                        <Truck className="h-4 w-4" />
                        <span>Free delivery on orders over ₹500</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={handleClearCart}
                  className="w-full text-gray-600 hover:text-red-600 font-medium py-2 transition-colors duration-200"
                >
                  Clear Cart
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <RefreshCw className="h-4 w-4" />
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
          <ProductDetailLayout
            product={selectedProduct}
            handleProductDetail={handleCloseDetail}
          />
        )}

      {/* Checkout Popup */}
      <CheckoutPopup
        isOpen={showCheckoutPopup}
        onClose={() => setShowCheckoutPopup(false)}
        cartItems={cartItems}
        total={total}
      />
    </div>
  );
};

export default Cart;
