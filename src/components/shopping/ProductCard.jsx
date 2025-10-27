import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addItemToCart, addItemToCartAction } from "../../Store/slice/cartSlice";

const ProductCard = ({ product, handleProductDetail, viewMode = "grid" }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addItemToCartAction({ product, quantity: 1 }));
    
  };

  // Normalize fields
  const price = product.salePrice ?? product.price ?? 0;
  const originalPrice = product.originalPrice ?? null;
  const quantity =
    typeof product.quantity === "object"
      ? `${product.quantity.amount} ${product.quantity.unit}`
      : product.quantity || "";

  // ----------------- LIST VIEW -----------------
  if (viewMode === "list") {
    return (
      <div
        onClick={handleProductDetail}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      >
        <div className="flex flex-col sm:items-center sm:flex-row">
          {/* Product Image */}
          <div className="relative w-full h-48 md:w-48 md:h-32">
            <img
              src={product.image}
              alt={product.title}
              className="w-auto h-full mx-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
            {product.offer && (
              <span className="absolute top-3 left-2 bg-gradient-to-r from-[#0C6C44] to-[#189a63] text-white text-xs font-semibold px-2 py-1 rounded-tl-lg rounded-br-lg shadow-md">
                {product.offer}% OFF
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight mb-1 truncate">
                {product.title}
                {quantity && (
                  <span className="text-gray-500 text-xs sm:text-sm font-normal ml-1">
                    ({quantity})
                  </span>
                )}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg sm:text-xl font-bold text-[#0C6C44]">
                  ₹{price.toFixed(2)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm sm:text-lg text-gray-500 line-through">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs sm:text-sm text-gray-500">
                Category:{" "}
                <span className="font-medium text-[#0C6C44]">
                  {product.category}
                </span>
              </span>
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="w-full sm:w-auto bg-[#0C6C44] text-white font-medium px-5 py-2 rounded-xl transition-all duration-300 hover:bg-[#095433] hover:shadow-lg text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------- GRID VIEW -----------------
  return (
    <div
      onClick={handleProductDetail}
      className="w-full sm:max-w-xs bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-auto h-24 md:h-32 mx-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
        {product.offer && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#0C6C44] to-[#189a63] text-white text-[8px] md:text-xs font-semibold px-2 py-1 rounded-tl-lg rounded-br-lg shadow-md">
            {product.offer}% OFF
          </span>
        )}
      </div>

      <div className="p-3 pb-0 flex flex-col gap-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight truncate">
          {product.title}
        </h3>

        {quantity && (
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {quantity}
          </span>
        )}

        <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-1 pb-2 -mt-1">
          <div>
            {originalPrice && originalPrice > price && (
              <div className="text-xs text-gray-400 line-through">
                ₹{originalPrice.toFixed(1)}
              </div>
            )}
            <div className="text-base md:text-lg font-bold text-[#0C6C44] -mt-1">
              ₹{price.toFixed(1)}
            </div>
          </div>

          <button
            onClick={(e) => handleAddToCart(e, product)}
            className="w-full sm:w-fit px-6 sm:px-8 bg-[#0C6C44] text-white font-medium py-2 rounded-xl transition-all duration-300 hover:bg-[#095433] hover:shadow-lg text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
