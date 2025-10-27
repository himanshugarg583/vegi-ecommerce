import React, { useEffect, useState, useMemo } from "react";
import Slider from "../../components/shopping/Slider";
import CitiesWeServe from "./CitiesWeServe";
import ProductCard from "../../components/shopping/ProductCard";
import ProductDetail from "../../components/shopping/ProductDetailLayout";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProduct,
  clearSelectedProduct,
  fetchProducts,
} from "../../Store/slice/productsSlice";
import CategoriesSection from "../../components/shopping/CategoriesSection";
import { Link } from "react-router-dom";
import ProductCarousel from "../../components/shopping/ProductCarousel";
import { addItemToCart, addItemToCartAction } from "../../Store/slice/cartSlice";
import { toast } from "react-toastify";
import ExclusiveProducts from "../../components/shopping/ExclusiveProducts";
import Loader from "../../components/common/Loader"
import { debounce } from "../../Utils/debounce";

const Home = () => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const products = useSelector((state) => state.products.products);
  const selectedProduct = useSelector(
    (state) => state.products.selectedProduct
  );

  
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
     dispatch(addItemToCartAction({ product, quantity: 1 })); 
  };

  const handleProductDetail = (id) => dispatch(selectProduct(id));
  const handleCloseDetail = () => dispatch(clearSelectedProduct());

  const slides = [
    "https://cdn.vegease.in/home-page/LIVE/1732088901649_grM8g.png",
    "https://cdn.vegease.in/home-page/LIVE/1732088932433_epB85.png",
    "https://cdn.vegease.in/home-page/LIVE/1732088918205_LiNr8.png",
    "https://cdn.vegease.in/home-page/LIVE/1732088925357_Fbo5D.png",
  ];

  const categories = ["All", "Fruits", "Vegetables", "Exotics"];

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(14);
      } else {
        setItemsPerPage(8);
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Filter + Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const category = product.category?.toLowerCase() || "";
        return (
          selectedCategory.toLowerCase() === "all" ||
          category === selectedCategory.toLowerCase()
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "name":
            return a.title.localeCompare(b.title);
          case "offer":
            return (b.offer || 0) - (a.offer || 0);
          default:
            return 0;
        }
      });
  }, [products, selectedCategory, sortBy]);

  // 🧭 Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const debouncedFetchProducts = useMemo(
      () => debounce(() => dispatch(fetchProducts()), 500),
      [dispatch]
    );

  useEffect(() => {
    if(!products || products.length == 0) {
               debouncedFetchProducts();}
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [selectedProduct]);

  if (!products || products.length === 0) {
  return <Loader message="Loading..." />;
}


  return (
    <div className="min-h-screen">
      {/* Slider */}
      <div className="mx-auto px-2 relative z-10 mt-5">
        <Slider slides={slides} />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 py-12 md:pt-20 mt-5 rounded-xl overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Fresh <span className="text-green-600">Organic</span> Produce
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the finest selection of fresh fruits and vegetables
              delivered straight to your doorstep
            </p>
          </div>

          <ExclusiveProducts
            products={products}
            handleAddToCart={handleAddToCart}
          />

          {/* Category Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:mb-12">
            {categories.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-green-50 hover:shadow-md"
                }`}
              >
                <div className="text-3xl mb-2">
                  {category === "Fruits" && "🍎"}
                  {category === "Vegetables" && "🥬"}
                  {category === "Exotics" && "🌱"}
                </div>
                <div className="font-semibold">{category}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mx-auto sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="offer">Best Offers</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 ${
                  viewMode === "grid"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 ${
                  viewMode === "list"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 md:gap-6"
              : "space-y-6"
          }`}
        >
          {paginatedProducts.map((item) => (
            <div key={item._id} onClick={() => handleProductDetail(item._id)}>
              <ProductCard product={item} viewMode={viewMode} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
  <div className="flex flex-col items-center justify-center mt-10 space-y-3">
    {/* Desktop Pagination */}
    <div className="hidden sm:flex justify-center items-center gap-2 flex-wrap">
      {/* Prev Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-all ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers with Ellipsis */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => {
          return (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
          );
        })
        .reduce((acc, page, i, arr) => {
          if (i > 0 && page - arr[i - 1] > 1) {
            acc.push("ellipsis-" + i);
          }
          acc.push(page);
          return acc;
        }, [])
        .map((page, index) =>
          typeof page === "string" ? (
            <span key={page} className="px-2 text-gray-400 select-none">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-all ${
                currentPage === page
                  ? "bg-green-600 text-white border-green-600 shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-green-50 hover:border-green-500"
              }`}
            >
              {page}
            </button>
          )
        )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-all ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600"
        }`}
      >
        Next
      </button>
    </div>

    {/* Mobile Pagination */}
    <div className="flex sm:hidden items-center justify-center gap-3 text-sm font-medium bg-white rounded-xl shadow-sm px-4 py-2 border border-gray-200">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg transition-all ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-green-700 hover:text-green-900"
        }`}
      >
        ← Prev
      </button>

      <span className="text-gray-700">
        Page <span className="font-semibold text-green-600">{currentPage}</span>{" "}
        of {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-lg transition-all ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-green-700 hover:text-green-900"
        }`}
      >
        Next →
      </button>
    </div>
  </div>
)}


        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            handleProductDetail={handleCloseDetail}
          />
        )}
      </div>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Horizontal Carousels */}
      <div className="space-y-20 mt-16">
        {[
          { title: "🌟 Check This Out", bg: "from-green-50/60 to-blue-50/60" },
          { title: "☀️ Summer Specials", bg: "from-yellow-50/60 to-orange-50/60" },
          { title: "🛒 Everyday Essentials", bg: "from-emerald-50/60 to-teal-50/60" },
          { title: "🥗 Crispy Crunchy Deals", bg: "from-lime-50/60 to-green-50/60" },
        ].map((section, idx) => (
          <div key={idx} className="relative rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                {section.title}
              </h1>
              <Link
                to="/products"
                className="text-green-700 font-medium hover:text-green-900 transition-colors"
              >
                View All →
              </Link>
            </div>

            <ProductCarousel
              products={products}
              viewMode="grid"
              handleProductDetail={handleProductDetail}
            />
          </div>
        ))}
      </div>

      {/* <CitiesWeServe /> */}
    </div>
  );
};

export default Home;
