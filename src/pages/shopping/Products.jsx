import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProduct,
  clearSelectedProduct,
  fetchProducts,
} from "../../Store/slice/productsSlice";
import ProductCard from "../../components/shopping/ProductCard";
import ProductDetailLayout from "../../components/shopping/ProductDetailLayout";
import CategoriesSection from "../../components/shopping/CategoriesSection";
import ProductCarousel from "../../components/shopping/ProductCarousel";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { debounce } from "../../Utils/debounce";

const categories = ["All", "Fruits", "Vegetables", "Exotics"];

function capitalizeWords(str) {
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Products() {
  const { category: routeSubCategory } = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const selectedProduct = useSelector(
    (state) => state.products.selectedProduct
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");

  const handleProductDetail = (id) => dispatch(selectProduct(id));
  const handleCloseDetail = () => dispatch(clearSelectedProduct());

  // Disable scroll when product detail modal is open
  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  const debouncedFetchProducts = useMemo(
    () => debounce(() => dispatch(fetchProducts()), 500),
    [dispatch]
  );

  useEffect(() => {
    if (!products || products.length == 0) {
      debouncedFetchProducts();
    }
  }, [dispatch]);

  // Filter + sort logic
  const displayProducts = useMemo(() => {
    let filtered = products;

    // Filter by route subcategory or selected category
    if (routeSubCategory) {
      filtered = filtered.filter(
        (p) => p.subCategory.toLowerCase() === routeSubCategory.toLowerCase()
      );
    } else if (selectedCategory !== "All") {
      filtered = products.filter((product) => {
        const category = product.category?.toLowerCase() || "";
        return (
          selectedCategory.toLocaleLowerCase() === "all" ||
          category === selectedCategory.toLowerCase()
        );
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "offer":
          return (b.offer || 0) - (a.offer || 0);
        default:
          return 0;
      }
    });
  }, [products, routeSubCategory, selectedCategory, searchTerm, sortBy]);

  // 🧠 Responsive pagination: 21 items on lg+, 20 otherwise
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth >= 1024 ? 21 : 20
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 21 : 20);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayProducts.slice(start, start + itemsPerPage);
  }, [displayProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const headerTitle = routeSubCategory
    ? capitalizeWords(routeSubCategory)
    : selectedCategory === "All"
    ? "All Products"
    : selectedCategory;

  const isLoading = useSelector((state) => state.products.isLoading);

  if (isLoading) return <Loader message="Loading..." />;

  return (
    <div className="min-h-screen bg-white py-5 md:py-10">
      <div className="mx-auto md:px-10 xl:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            {headerTitle}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {!routeSubCategory && (
              <>
                {/* Category Selector */}
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Sort Selector */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="offer">Best Offers</option>
                </select>
              </>
            )}

            {/* View Mode Toggle */}
            <div className="flex w-full sm:w-auto border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 px-4 py-2 text-center ${
                  viewMode === "grid"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0-012-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0-012-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 px-4 py-2 text-center ${
                  viewMode === "list"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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

        {/* Products Section */}
        {displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            {routeSubCategory && (
              <Link
                to="/products"
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-green-700 transition"
              >
                Back to All Products
              </Link>
            )}
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 md:gap-6"
                  : "space-y-6"
              }
            >
              {paginatedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleProductDetail(item._id)}
                >
                  <ProductCard product={item} viewMode={viewMode} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
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
                        <span
                          key={page}
                          className="px-2 text-gray-400 select-none"
                        >
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
                    Page{" "}
                    <span className="font-semibold text-green-600">
                      {currentPage}
                    </span>{" "}
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
          </>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailLayout
            product={selectedProduct}
            handleProductDetail={handleCloseDetail}
          />
        )}

        {/* Horizontal Product Sections */}
        <div className="space-y-16 mt-24">
          {[
            "🌟 Check This Out",
            "☀️ Summer Specials",
            "🛒 Everyday Essentials",
            "🥗 Crispy Crunchy Deals",
          ].map((title, idx) => (
            <div key={idx} className="relative rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between mb-2 md:mb-5">
                <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                  {title}
                </h1>
              </div>
              <ProductCarousel
                products={products}
                viewMode="grid"
                handleProductDetail={handleProductDetail}
              />
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <CategoriesSection />
      </div>
    </div>
  );
}

export default Products;
