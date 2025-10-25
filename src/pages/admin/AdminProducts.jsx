import { Eye, Filter, Package2, Search } from 'lucide-react'
import React from 'react'

function AdminProducts() {
  const products = [
    {
      id: '#50',
      name: 'Aman Singh Bisht',
      category: 'Bedsheet',
      price: '$500.00',
      stock: 10,
      status: 'In Stock',
    },
    // Add more products here
  ]

  return (
    <div className="w-full py-5 overflow-x-auto" aria-label="Products Management Section">
      {/* Screen reader heading for SEO */}
      <h1 className="sr-only">Comfy Store Products</h1>

      <section className="bg-white min-h-72 rounded-xl mt-5 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-500"><Package2 /></span>
            <h2 className="text-2xl font-semibold">Products</h2>
          </div>
          <button aria-label="Filter Products"><Filter /></button>
        </div>

        {/* Search */}
        <div className="w-full mt-10">
          <label htmlFor="searchProducts" className="sr-only">Search Products</label>
          <div className="w-full p-3 px-5 rounded-lg bg-zinc-100 flex items-center gap-4 text-zinc-500">
            <Search />
            <input
              id="searchProducts"
              className="w-full bg-transparent outline-none"
              type="text"
              placeholder="Search Products"
            />
          </div>

          {/* Products Table */}
          <div className="w-full overflow-x-auto mt-8 rounded-xl">
            <table
              className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg"
              role="table"
              aria-label="List of Products"
            >
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Id</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700"><b>{product.id}</b></td>
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 font-semibold rounded-full text-sm ${product.status === 'In Stock' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Comfy Store Products",
            "description": "List of products available in Comfy Store",
            "itemListElement": products.map((product, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": product.name,
              "category": product.category,
              "offers": {
                "@type": "Offer",
                "price": parseFloat(product.price.replace('$','')),
                "priceCurrency": "USD",
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
              }
            }))
          })
        }}
      />
    </div>
  )
}

export default AdminProducts
