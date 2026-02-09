// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CreateMerchandise from "./CreateMerchandise";
// import MerchandiseList from "./MerchandiseList";
// import AddVariants from "./AddVariants";

// export default function AddMerchandise() {
//   const navigate = useNavigate();
//   const [userToken] = useState(localStorage.getItem("token"));
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [refreshList, setRefreshList] = useState(0);

//   useEffect(() => {
//     if (!userToken) {
//       navigate("/login");
//     }
//   }, [userToken, navigate]);

//   const handleProductCreated = () => {
//     setSelectedProduct(null);
//     setRefreshList(prev => prev + 1);
//   };

//   const handleVariantAdded = () => {
//     setRefreshList(prev => prev + 1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8">Add Merchandise</h1>

//         {/* Step 1: Create Product */}
//         <CreateMerchandise onProductCreated={handleProductCreated} />

//         {/* Step 2: List Products */}
//         <MerchandiseList 
//           onSelectProduct={setSelectedProduct}
//           refreshTrigger={refreshList}
//         />

//         {/* Step 3: Add Variants */}
//         {selectedProduct && (
//           <div className="mt-8">
//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="bg-gray-500 text-white px-4 py-2 mb-4 rounded"
//             >
//               ← Back to Products List
//             </button>
//             <AddVariants
//               productId={selectedProduct.id}
//               productData={selectedProduct}
//               onVariantAdded={handleVariantAdded}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateMerchandise from "./CreateMerchandise";
import MerchandiseList from "./MerchandiseList";
import AddVariants from "./AddVariants";

export default function AddMerchandise({ onProductCreated }) {
  const navigate = useNavigate();
  const [userToken] = useState(localStorage.getItem("token"));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshList, setRefreshList] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken, navigate]);

  const handleProductCreated = () => {
    setSelectedProduct(null);
    setRefreshList(prev => prev + 1);
    setCurrentStep(2); // Move to product list after creation
  };

  const handleVariantAdded = () => {
    setRefreshList(prev => prev + 1);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentStep(3); // Move to variants step
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setCurrentStep(2);
  };

  const handleBackToCreate = () => {
    setSelectedProduct(null);
    setCurrentStep(1);
  };

  const handleComplete = () => {
    if (onProductCreated) {
      onProductCreated();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      {/* Progress Steps */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1 */}
          <div className="flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                currentStep >= 1 
                  ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg" 
                  : "bg-slate-200 text-slate-500"
              }`}>
                {currentStep > 1 ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "1"}
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep >= 1 ? "text-purple-600" : "text-slate-500"}`}>
                Create Product
              </span>
            </div>
          </div>

          {/* Connector Line */}
          <div className={`flex-1 h-1 mx-2 -mt-6 transition-all ${
            currentStep >= 2 ? "bg-purple-500" : "bg-slate-200"
          }`}></div>

          {/* Step 2 */}
          <div className="flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                currentStep >= 2 
                  ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg" 
                  : "bg-slate-200 text-slate-500"
              }`}>
                {currentStep > 2 ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "2"}
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep >= 2 ? "text-purple-600" : "text-slate-500"}`}>
                Select Product
              </span>
            </div>
          </div>

          {/* Connector Line */}
          <div className={`flex-1 h-1 mx-2 -mt-6 transition-all ${
            currentStep >= 3 ? "bg-purple-500" : "bg-slate-200"
          }`}></div>

          {/* Step 3 */}
          <div className="flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                currentStep >= 3 
                  ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg" 
                  : "bg-slate-200 text-slate-500"
              }`}>
                3
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep >= 3 ? "text-purple-600" : "text-slate-500"}`}>
                Add Variants
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-fade-in">
        {/* Step 1: Create Product */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Base Product</h2>
                  <p className="text-purple-100 text-sm">Set up your merchandise product details</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <CreateMerchandise onProductCreated={handleProductCreated} />
            </div>
          </div>
        )}

        {/* Step 2: Product List */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Select Product</h2>
                      <p className="text-purple-100 text-sm">Choose a product to add variants</p>
                    </div>
                  </div>
                  <button
                    onClick={handleBackToCreate}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Another
                  </button>
                </div>
              </div>
              <div className="p-8">
                <MerchandiseList 
                  onSelectProduct={handleSelectProduct}
                  refreshTrigger={refreshList}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete Setup
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add Variants */}
        {currentStep === 3 && selectedProduct && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add Variants</h2>
                    <p className="text-purple-100 text-sm">Product: {selectedProduct.title}</p>
                  </div>
                </div>
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Products
                </button>
              </div>
            </div>

            {/* Product Info Card */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
              <div className="flex items-start gap-6">
                {selectedProduct.image && (
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.title}
                    className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedProduct.title}</h3>
                  <p className="text-slate-600 text-sm mb-3">{selectedProduct.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ₹{parseFloat(selectedProduct.price).toFixed(2)}
                    </span>
                    {selectedProduct.category_name && (
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {selectedProduct.category_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <AddVariants
                productId={selectedProduct.id}
                productData={selectedProduct}
                onVariantAdded={handleVariantAdded}
              />
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 border-2 border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Add More Variants
              </button>
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete & Finish
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">How it works:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Create your base merchandise product with basic details</li>
              <li>Select the product from your list</li>
              <li>Add variants with different colors, sizes, and prices</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}