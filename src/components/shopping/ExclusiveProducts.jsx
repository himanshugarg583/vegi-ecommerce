import React, { useRef, useEffect } from "react";

const ExclusiveProducts = ({ products, handleAddToCart }) => {
  const carouselRef = useRef(null);

  // Auto-scroll carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 0;
    const step = 1;
    const interval = setInterval(() => {
      if (carousel) {
        scrollAmount += step;
        if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
          scrollAmount = 0;
        }
        carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  // Responsive widths
  const cardWidthClass =
    "flex-shrink-0 lg:w-[calc(100%/6)] md:w-[calc(100%/3)] sm:w-[calc(100%/2)] w-[calc(100%/2)]";

  return (
    <div className="my-10 mx-auto">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto sm:px-4 snap-x sm:gap-[8px] snap-mandatory no-scrollbar"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((item, index) => (
          <div key={index} className={`${cardWidthClass} snap-start`}>
            <ProductCard item={item} handleAddToCart={handleAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ item, handleAddToCart }) => (
  <div className="flex items-center justify-center w-full">
    <div
      className="
        relative flex flex-col p-2 
        bg-[linear-gradient(rgb(135,204,136)_0%,_rgb(253,247,250)_100%)]
        rounded-lg shadow-md
        lg:h-60 md:h-52 sm:h-44 h-44
        lg:w-[95%] md:w-[90%] sm:w-[85%] w-[90%]
        transition-all duration-300
      "
      style={{
        clipPath: "polygon(0 0, 100% 0, 87.5% 100%, 12.5% 100%)",
      }}
    >
      {/* Product Image */}
      <div className="flex justify-center flex-grow mt-2 mb-2">
        <img
          src={item.image}
          alt={item.title}
          className="object-contain
            lg:h-24 md:h-20 sm:h-16 h-12"
        />
      </div>

      {/* Product Title */}
      <p className="text-black text-sm font-semibold text-center truncate mt-1 lg:text-sm md:text-sm sm:text-xs text-xs">
        {item.title}
      </p>

      {/* Price & Quantity */}
      <div className="text-black text-xs md:text-sm font-semibold text-center">
        <div>$ {item.originalPrice}</div>
        <div className="text-gray-500 text-[11px]">
          {typeof item.quantity === "object" 
            ? `${item.quantity.amount} ${item.quantity.unit}` 
            : item.quantity}
        </div>
      </div>

      {/* + ADD Button */}
      <div className="mt-auto flex justify-center">
        <button
          onClick={(e) => handleAddToCart(e, item)}
          className="w-full text-white font-semibold bg-[#106e4c] 
                     lg:text-sm md:text-sm sm:text-xs text-xs py-1 rounded-md"
        >
          + ADD
        </button>
      </div>
    </div>
  </div>
);

export default ExclusiveProducts;
