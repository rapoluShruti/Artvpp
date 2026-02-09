// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getUserFromToken } from "../../utils/auth";
// import BecomeArtist from "../BecomeArtist";
// import AddDigitalProduct from "./AddDigitalProduct";
// import AddMerchandise from "./AddMerchandise";
// import AddProduct from "./AddProduct";

// export default function ArtistDashboard() {
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   // Lightweight demo metrics to show when real data is not present
//   const demoMetrics = {
//     totalOrders: 24,
//     completed: 18,
//     pending: 4,
//     revenue: 2780,
//     todaysDeliveries: 2,
//     pendingConfirmations: 3,
//   };

//   return (
//     <>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold">Artist Dashboard</h1>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => navigate("/artist/manage-products")}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
//             >
//               📊 Manage Products
//             </button>

//             {/** Provide Services button visible only to users with role 'artist' **/}
//             {(() => {
//               let isArtist = false;
//               try {
//                 const user = getUserFromToken();
//                 isArtist = user && user.role === "artist";
//               } catch (e) {
//                 isArtist = false;
//               }
//               return isArtist ? (
//                 <button
//                   onClick={() => navigate("/artist/manage-products")}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
//                 >
//                   ➕ Add Products
//                 </button>
//               ) : null;
//             })()}
//           </div>
//         </div>

//         {/* Demo Metrics Banner (helpful when no backend data is loaded) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="text-sm text-gray-500">Total Orders</div>
//             <div className="text-2xl font-bold">{demoMetrics.totalOrders}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="text-sm text-gray-500">Completed</div>
//             <div className="text-2xl font-bold text-green-600">{demoMetrics.completed}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="text-sm text-gray-500">Pending</div>
//             <div className="text-2xl font-bold text-yellow-600">{demoMetrics.pending}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="text-sm text-gray-500">Revenue</div>
//             <div className="text-2xl font-bold text-purple-600">₹{demoMetrics.revenue}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="text-sm text-gray-500">Today's Deliveries</div>
//             <div className="text-2xl font-bold text-green-600">{demoMetrics.todaysDeliveries}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="text-sm text-gray-500">Pending Confirmations</div>
//             <div className="text-2xl font-bold text-yellow-600">{demoMetrics.pendingConfirmations}</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
//           {/* Add Products Section */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-6 rounded-lg shadow-lg sticky top-20">
//               <h2 className="text-2xl font-bold mb-4">What to Sell?</h2>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => setSelectedCategory("physical")}
//                   className={`w-full text-left px-4 py-3 rounded font-semibold transition ${
//                     selectedCategory === "physical"
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 hover:bg-gray-200"
//                   }`}
//                 >
//                   ➕ Physical Art
//                 </button>
//                 <button
//                   onClick={() => setSelectedCategory("merchandise")}
//                   className={`w-full text-left px-4 py-3 rounded font-semibold transition ${
//                     selectedCategory === "merchandise"
//                       ? "bg-purple-600 text-white"
//                       : "bg-gray-100 hover:bg-gray-200"
//                   }`}
//                 >
//                   📦 Merchandise
//                 </button>
//                 <button
//                   onClick={() => setSelectedCategory("digital")}
//                   className={`w-full text-left px-4 py-3 rounded font-semibold transition ${
//                     selectedCategory === "digital"
//                       ? "bg-pink-600 text-white"
//                       : "bg-gray-100 hover:bg-gray-200"
//                   }`}
//                 >
//                   💾 Digital Product
//                 </button>
//               </div>

//               <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h3 className="font-bold text-sm mb-2">💡 What's best for you?</h3>
//                 <div className="text-xs text-gray-700 space-y-2">
//                   <p><strong>Physical Art:</strong> Paintings, sculptures, prints</p>
//                   <p><strong>Merchandise:</strong> T-shirts, mugs, hoodies with variants</p>
//                   <p><strong>Digital:</strong> E-books, software, NFTs</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Info Cards */}
//           <div className="lg:col-span-2 space-y-4">
//             <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
//               <h3 className="font-bold text-lg mb-2">💡 Tips for Success</h3>
//               <ul className="text-sm space-y-1 text-gray-700">
//                 <li>✓ Add high-quality product images</li>
//                 <li>✓ Write detailed descriptions</li>
//                 <li>✓ Set competitive pricing</li>
//                 <li>✓ Use discounts strategically to boost sales</li>
//               </ul>
//             </div>
//             <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
//               <h3 className="font-bold text-lg mb-2">📈 Selling Tips</h3>
//               <ul className="text-sm space-y-1 text-gray-700">
//                 <li>✓ Keep your artist profile updated</li>
//                 <li>✓ Respond to customer inquiries quickly</li>
//                 <li>✓ Manage inventory for merchandise variants</li>
//                 <li>✓ Track your orders and sales analytics</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Conditional Form Display */}
//       {selectedCategory && (
//         <div className="max-w-7xl mx-auto px-4 space-y-12 py-12">
//           {/* Physical Art Form */}
//           {selectedCategory === "physical" && (
//             <div className="bg-white p-8 rounded-lg shadow-lg">
//               <div className="flex justify-between items-center mb-6 border-b pb-4">
//                 <h2 className="text-3xl font-bold">Add Physical Art Product</h2>
//                 <button
//                   onClick={() => setSelectedCategory(null)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <AddProduct onProductCreated={() => setSelectedCategory(null)} />
//             </div>
//           )}

//           {/* Merchandise Form */}
//           {selectedCategory === "merchandise" && (
//             <div className="bg-white p-8 rounded-lg shadow-lg">
//               <div className="flex justify-between items-center mb-6 border-b pb-4">
//                 <h2 className="text-3xl font-bold">Add Merchandise Product</h2>
//                 <button
//                   onClick={() => setSelectedCategory(null)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <AddMerchandise onProductCreated={() => setSelectedCategory(null)} />
//             </div>
//           )}

//           {/* Digital Product Form */}
//           {selectedCategory === "digital" && (
//             <div className="bg-white p-8 rounded-lg shadow-lg">
//               <div className="flex justify-between items-center mb-6 border-b pb-4">
//                 <h2 className="text-3xl font-bold">Add Digital Product</h2>
//                 <button
//                   onClick={() => setSelectedCategory(null)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <AddDigitalProduct onProductCreated={() => setSelectedCategory(null)} />
//             </div>
//           )}
//         </div>
//       )}

//       {!selectedCategory && (
//         <div className="max-w-7xl mx-auto px-4 py-12 text-center">
//           <div className="bg-gray-50 p-12 rounded-lg">
//             <p className="text-lg text-gray-600 mb-4">👈 Select a product type to get started</p>
//             <p className="text-sm text-gray-500">Choose what you'd like to sell and fill in the details</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";
import BecomeArtist from "../BecomeArtist";
import AddDigitalProduct from "./AddDigitalProduct";
import AddMerchandise from "./AddMerchandise";
import AddProduct from "./AddProduct";

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const demoMetrics = {
    totalOrders: 24,
    completed: 18,
    pending: 4,
    revenue: 2780,
    todaysDeliveries: 2,
    pendingConfirmations: 3,
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Smooth scroll to top when form opens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setSelectedCategory(null);
  };

  // If a category is selected, show only the form
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedCategory === "physical" && "Add Physical Art Product"}
                    {selectedCategory === "merchandise" && "Add Merchandise Product"}
                    {selectedCategory === "digital" && "Add Digital Product"}
                  </h2>
                  <p className="text-slate-300 text-sm">
                    {selectedCategory === "physical" && "Paintings, sculptures, prints, and original artwork"}
                    {selectedCategory === "merchandise" && "T-shirts, mugs, hoodies with size and color variants"}
                    {selectedCategory === "digital" && "E-books, digital art, NFTs, and downloadable content"}
                  </p>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                  title="Back to categories"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {selectedCategory === "physical" && (
                <AddProduct onProductCreated={handleCloseForm} />
              )}
              {selectedCategory === "merchandise" && (
                <AddMerchandise onProductCreated={handleCloseForm} />
              )}
              {selectedCategory === "digital" && (
                <AddDigitalProduct onProductCreated={handleCloseForm} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view - show only category selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Artist Dashboard</h1>
            <p className="text-slate-600">Manage your products and track your sales</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/artist/manage-products")}
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Manage Products
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Total Orders</span>
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{demoMetrics.totalOrders}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-600">Completed</span>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700">{demoMetrics.completed}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-600">Pending</span>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700">{demoMetrics.pending}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-600">Revenue</span>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-700">₹{demoMetrics.revenue}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Today's Deliveries</span>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700">{demoMetrics.todaysDeliveries}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-600">Confirmations</span>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-700">{demoMetrics.pendingConfirmations}</div>
          </div>
        </div>

        {/* Product Category Selection */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">What would you like to sell?</h2>
            <p className="text-slate-600 text-lg">Choose a product category to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Physical Art Card */}
            <button
              onClick={() => handleCategorySelect("physical")}
              className="group bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                Physical Art
              </h3>
              <p className="text-slate-600 mb-4 text-sm">
                Paintings, sculptures, prints, and original artwork
              </p>
              <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                Get Started
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Merchandise Card */}
            <button
              onClick={() => handleCategorySelect("merchandise")}
              className="group bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                Merchandise
              </h3>
              <p className="text-slate-600 mb-4 text-sm">
                T-shirts, mugs, hoodies with size and color variants
              </p>
              <div className="flex items-center text-purple-600 font-medium text-sm group-hover:gap-2 transition-all">
                Get Started
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Digital Product Card */}
            <button
              onClick={() => handleCategorySelect("digital")}
              className="group bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-pink-500 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                Digital Product
              </h3>
              <p className="text-slate-600 mb-4 text-sm">
                E-books, digital art, NFTs, and downloadable content
              </p>
              <div className="flex items-center text-pink-600 font-medium text-sm group-hover:gap-2 transition-all">
                Get Started
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}