import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductCarousel = ({ products, viewMode, handleProductDetail }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.2; // slow, gentle scroll
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full group">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-xl border border-white/40 shadow-xl p-2 rounded-full hover:bg-white/40 transition-all duration-300"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-xl border border-white/40 shadow-xl p-2 rounded-full hover:bg-white/40 transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll gap-4 px-2 py-2 scroll-smooth no-scrollbar"
      >
        {Array(6)
          .fill(products)
          .flat()
          .map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleProductDetail(product._id)}
            >
              <ProductCard
                product={product}
                viewMode={viewMode}
                handleProductDetail={() => handleProductDetail(product._id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
