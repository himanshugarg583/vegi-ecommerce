import React from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addItemToCartAction } from "../../store/slice/cartSlice";
import { clearSelectedProduct } from "../../store/slice/productsSlice";

const ProductDetailLayout = ({ product }) => {
  const dispatch = useDispatch();

  if (!product) return null;

  const handleAddToCart = (product) => {
    dispatch(addItemToCartAction({ product, quantity: 1 }));
  };

  const handleCloseDetail = () => dispatch(clearSelectedProduct());

  return (
    <div onClick={handleCloseDetail} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 overflow-auto">
      {/* Main Card */}
      <div  onClick={(e) => e.stopPropagation()} className="relative bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl max-w-4xl w-full overflow-hidden">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleCloseDetail}
            className="flex items-center justify-center text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 p-6 sm:p-8">
          {/* Product Image */}
          <div className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-white backdrop-blur-sm">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-64 md:h-80 object-contain"
            />
            {product.offer && (
              <span className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-tl-lg rounded-br-lg shadow-md">
                {product.offer}% OFF
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between space-y-4 sm:space-y-6 text-gray-900">
            {/* Title + Category */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Category:{" "}
                <span className="font-medium text-gray-800 capitalize">
                  {product.category}
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {product.description || "No description available for this product."}
            </p>

            {/* Price + Stock */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-green-700">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm sm:text-lg">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium text-gray-800">In Stock:</span> {product.totalStock} units
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium text-gray-800">Quantity:</span>{" "}
                {typeof product.quantity === "object" 
                  ? `${product.quantity.amount} ${product.quantity.unit}` 
                  : product.quantity}
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full md:w-3/4 bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:bg-green-800 hover:shadow-lg focus:ring-2 focus:ring-green-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailLayout;
