import React from "react";
import { Link, useLocation } from "react-router-dom";

const categories = [
  {
    name: "Exotic Fruits",
    img: "https://egreensapp.s3.ap-south-1.amazonaws.com/LIVE/category/1742213217766_oZBiV.png",
    href: "/products/exotic-fruits",
  },
  {
    name: "Exotic Vegetables",
    img: "https://egreensapp.s3.ap-south-1.amazonaws.com/LIVE/category/1742213096127_sqlln.png",
    href: "/products/exotic-vegetables",
  },
  {
    name: "Fresh Fruits",
    img: "https://egreensapp.s3.ap-south-1.amazonaws.com/LIVE/category/1742213050592_u56OR.png",
    href: "/products/fresh-fruits",
  },
  {
    name: "Fresh Vegetables",
    img: "https://egreensapp.s3.ap-south-1.amazonaws.com/LIVE/category/1742213065370_M4odj.png",
    href: "/products/fresh-vegetables",
  },
  {
    name: "Leaf & Herbs",
    img: "https://egreensapp.s3.ap-south-1.amazonaws.com/LIVE/category/1742213105974_HdwLS.png",
    href: "/products/Leaf-Herbs",
  },
  {
    name: "Summer Deals",
    img: "https://egreensapp.s3.ap-south-1.amazonaws.com/LIVE/category/1742537055618_wAsTg.png",
    href: "/products/Summer-Deals",
  },
];

const CategoriesSection = () => {
  const { pathname } = useLocation();

  return (
    <section className="bg-gradient-to-b from-green-600 to-green-700 py-12 md:py-20 rounded-2xl my-10 md:my-16">
      {/* Heading */}
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 sm:mb-3 tracking-wide">
          Stay Updated with Fresh Deals
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-green-100">
          Discover boundless choices with over 500+ handpicked products
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-8 sm:mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat, idx) => (
            <Link
              to={cat.href}
              key={idx}
              className="group flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 p-3 sm:p-4 cursor-pointer border border-gray-100 hover:border-green-500 hover:-translate-y-1"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2 sm:mb-4 p-2 bg-green-50 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="object-contain w-full h-full"
                />
              </div>
              <h4 className="text-gray-800 font-medium text-xs sm:text-sm md:text-base group-hover:text-green-700 transition-colors">
                {cat.name}
              </h4>
            </Link>
          ))}
        </div>
      </div>

      {/* All Products Button */}
      {!pathname.includes("/products") && (
        <div className="max-w-xs sm:max-w-sm mx-auto mt-8 sm:mt-12 px-4">
          <div className="bg-white rounded-full shadow-lg flex overflow-hidden justify-center transition-all duration-300 transform hover:bg-white/20 hover:backdrop-blur-md hover:text-white hover:scale-105 hover:shadow-xl">
            <Link
              to="/products"
              className="w-full text-center text-green-600 font-semibold px-6 py-3 rounded-full text-sm sm:text-base hover:text-white"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
