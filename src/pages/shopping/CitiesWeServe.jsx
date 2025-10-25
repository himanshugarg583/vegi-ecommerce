import React from "react";

const cities = [
  { 
    name: "Mumbai", 
    img: "/images/city-mumbai.svg",
    population: "20M+",
    deliveryTime: "30 min",
    color: "from-blue-500 to-blue-600"
  },
  { 
    name: "Bangalore", 
    img: "/images/city-banglore.svg",
    population: "12M+",
    deliveryTime: "25 min",
    color: "from-green-500 to-green-600"
  },
  { 
    name: "Delhi", 
    img: "/images/city-delhi.svg",
    population: "32M+",
    deliveryTime: "35 min",
    color: "from-orange-500 to-orange-600"
  },
  { 
    name: "Chennai", 
    img: "https://img.freepik.com/premium-psd/picture-temple-with-words-god-front_1020495-759215.jpg?semt=ais_hybrid&w=740&q=80",
    population: "10M+",
    deliveryTime: "28 min",
    color: "from-purple-500 to-purple-600"
  },
  { 
    name: "Kolkata", 
    img: "https://i.pinimg.com/236x/7d/4b/e4/7d4be485f9d23b5cd5e153ddcee15e3c.jpg",
    population: "15M+",
    deliveryTime: "32 min",
    color: "from-red-500 to-red-600"
  },
  { 
    name: "Hyderabad", 
    img: "https://www.shutterstock.com/image-vector/illustration-charminar-monument-hyderabad-telangana-260nw-2511481515.jpg",
    population: "9M+",
    deliveryTime: "26 min",
    color: "from-teal-500 to-teal-600"
  }
];

const CitiesWeServe = () => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cities We <span className="text-green-600">Serve</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Delivering fresh produce to major cities across India with lightning-fast delivery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {cities.map((city, index) => (
          <div
            key={city.name}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${city.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* City image */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4">
            <img
              src={city.img}
              alt={city.name}
              loading="lazy"
                    className="w-16 h-16 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Online indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  {city.name}
                </h3>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{city.deliveryTime}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{city.population}</span>
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* Additional info section */}
        {/* <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Don't see your city?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We're constantly expanding our delivery network. Let us know your city and we'll notify you when we start delivering there!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter your city name"
                className="flex-1 px-6 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300 transform hover:scale-105">
                Notify Me
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CitiesWeServe;
