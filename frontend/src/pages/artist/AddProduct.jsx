// import { useEffect, useState } from "react";
// import api from "../../api";

// export default function AddProduct() {

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [subcategory, setSubcategory] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [size, setSize] = useState("");
//   const [weight, setWeight] = useState("");
//   const [isFragile, setIsFragile] = useState(false);

//   const [images, setImages] = useState([]);
//   const [video, setVideo] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [userToken, setUserToken] = useState(null);

//   // Load categories
//   useEffect(() => {
//     api.get("/categories").then(res => {
//       setCategories(res.data);
//     });
//   }, []);

//   // Check if user is logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("AddProduct mount - Token from localStorage:", token);
//     setUserToken(token);
//     if (!token) {
//       alert("Please login first");
//       window.location.href = "/login";
//     }
//   }, []);

//   // Determine which fields to show based on subcategory
//   const needsFragile = ["original_artwork", "handcrafted"].includes(subcategory);
//   const needsQuantity = subcategory !== "original_artwork";
//   const needsSize = ["original_artwork", "print", "miniature", "handcrafted"].includes(subcategory);
//   const needsWeight = ["handcrafted", "miniature", "original_artwork"].includes(subcategory);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate required fields
//     if (!title || !description || !price || !subcategory || !categoryId || images.length === 0) {
//       alert("Please fill all required fields and select at least one image");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     console.log("Token:", token);
//     console.log("Auth Header will be:", `Bearer ${token}`);

//     const formData = new FormData();

//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("price", price);
//     formData.append("subcategory", subcategory);
//     formData.append("category_id", categoryId);
//     // Send quantity and weight as numbers only if they have values
//     formData.append("quantity", needsQuantity ? parseInt(quantity) || 1 : 1);
//     formData.append("size", needsSize ? size : "");
//     formData.append("weight", needsWeight ? (weight ? parseFloat(weight) : "") : "");
//     formData.append("is_fragile", needsFragile ? isFragile : false);

//     images.forEach(img => {
//       formData.append("images", img);
//     });

//     if (video) {
//       formData.append("video", video);
//     }

//     try {
//       await api.post("/products/physical-art", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       alert("Product Added Successfully");
//       // Reset form
//       setTitle("");
//       setDescription("");
//       setPrice("");
//       setSubcategory("");
//       setCategoryId("");
//       setQuantity(1);
//       setSize("");
//       setWeight("");
//       setIsFragile(false);
//       setImages([]);
//       setVideo(null);

//     } catch (err) {
//       alert(err.response?.data?.message || "Upload failed");
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl">

//       <h2 className="text-xl font-bold mb-4">Add Product</h2>
      
//       {!userToken && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           ⚠️ Not logged in! Token: {userToken ? "Present" : "Missing"}
//         </div>
//       )}
//       {userToken && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           ✓ Logged in
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>

//         <input
//           placeholder="Title"
//           value={title}
//           className="border p-2 w-full mb-3"
//           onChange={e => setTitle(e.target.value)}
//         />

//         <textarea
//           placeholder="Description"
//           value={description}
//           className="border p-2 w-full mb-3"
//           onChange={e => setDescription(e.target.value)}
//         />

//         <input
//           placeholder="Price"
//           type="number"
//           value={price}
//           className="border p-2 w-full mb-3"
//           onChange={e => setPrice(e.target.value)}
//         />

//         {/* Category */}
//         <select
//           value={categoryId}
//           className="border p-2 w-full mb-3"
//           onChange={e => setCategoryId(e.target.value)}
//         >
//           <option value="">Select Category</option>
//           {categories.map(cat => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         {/* Sub Category */}
//         <select
//           className="border p-2 w-full mb-3 font-semibold"
//           value={subcategory}
//           onChange={e => setSubcategory(e.target.value)}
//         >
//           <option value="">Select Type</option>
//           <option value="original_artwork">Original Artwork</option>
//           <option value="print">Print</option>
//           <option value="handcrafted">Handcrafted</option>
//           <option value="miniature">Miniature</option>
//           <option value="tribal">Tribal Art</option>
//           <option value="art_books">Art Books</option>
//           <option value="stationery">Stationery</option>
//         </select>

//         {/* Quantity - Show only if not original artwork */}
//         {needsQuantity && (
//           <input
//             type="number"
//             placeholder="Quantity *"
//             min="1"
//             value={quantity}
//             className="border p-2 w-full mb-3"
//             onChange={e => setQuantity(parseInt(e.target.value) || 1)}
//             required
//           />
//         )}

//         {/* Size - Show only for certain types */}
//         {needsSize && (
//           <input
//             type="text"
//             placeholder="Size (e.g., 10x12 inches) *"
//             value={size}
//             className="border p-2 w-full mb-3"
//             onChange={e => setSize(e.target.value)}
//             required
//           />
//         )}

//         {/* Weight - Show only for certain types */}
//         {needsWeight && (
//           <input
//             type="text"
//             placeholder="Weight (e.g., 500g) *"
//             value={weight}
//             className="border p-2 w-full mb-3"
//             onChange={e => setWeight(e.target.value)}
//             required
//           />
//         )}

//         {/* Is Fragile - Show only for handmade/original artwork */}
//         {needsFragile && (
//           <label className="flex items-center mb-3 border p-2 rounded">
//             <input
//               type="checkbox"
//               checked={isFragile}
//               onChange={e => setIsFragile(e.target.checked)}
//               className="mr-2 w-4 h-4"
//             />
//             <span>Is Fragile (needs special handling)</span>
//           </label>
//         )}

//         {/* Images */}
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           className="mb-3"
//           onChange={e => setImages([...e.target.files])}
//         />

//         {/* Video */}
//         <input
//           type="file"
//           accept="video/*"
//           className="mb-3"
//           onChange={e => setVideo(e.target.files[0])}
//         />

//         <button className="bg-blue-600 text-white px-4 py-2">
//           Add Product
//         </button>

//       </form>

//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../../api";

export default function AddProduct({ onProductCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [weight, setWeight] = useState("");
  const [isFragile, setIsFragile] = useState(false);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load categories
  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data);
    });
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserToken(token);
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
    }
  }, []);

  // Determine which fields to show based on subcategory
  const needsFragile = ["original_artwork", "handcrafted"].includes(subcategory);
  const needsQuantity = subcategory !== "original_artwork";
  const needsSize = ["original_artwork", "print", "miniature", "handcrafted"].includes(subcategory);
  const needsWeight = ["handcrafted", "miniature", "original_artwork"].includes(subcategory);

  const subcategoryOptions = [
    { value: "original_artwork", label: "Original Artwork", icon: "🎨", desc: "One-of-a-kind pieces" },
    { value: "print", label: "Print", icon: "🖼️", desc: "Reproductions of artwork" },
    { value: "handcrafted", label: "Handcrafted", icon: "✋", desc: "Handmade items" },
    { value: "miniature", label: "Miniature", icon: "🏛️", desc: "Small-scale art pieces" },
    { value: "tribal", label: "Tribal Art", icon: "🗿", desc: "Traditional tribal artwork" },
    { value: "art_books", label: "Art Books", icon: "📚", desc: "Books about art" },
    { value: "stationery", label: "Stationery", icon: "✏️", desc: "Art supplies & stationery" },
  ];

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImages(files);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !description || !price || !subcategory || !categoryId || images.length === 0) {
      alert("Please fill all required fields and select at least one image");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("subcategory", subcategory);
    formData.append("category_id", categoryId);
    formData.append("quantity", needsQuantity ? parseInt(quantity) || 1 : 1);
    formData.append("size", needsSize ? size : "");
    formData.append("weight", needsWeight ? (weight ? parseFloat(weight) : "") : "");
    formData.append("is_fragile", needsFragile ? isFragile : false);

    images.forEach(img => {
      formData.append("images", img);
    });

    if (video) {
      formData.append("video", video);
    }

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await api.post("/products/physical-art", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-in-right flex items-center gap-3';
      notification.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <div>
          <div class="font-semibold">Product Added Successfully!</div>
          <div class="text-sm opacity-90">Your product is now live</div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setSubcategory("");
      setCategoryId("");
      setQuantity(1);
      setSize("");
      setWeight("");
      setIsFragile(false);
      setImages([]);
      setImagePreviews([]);
      setVideo(null);
      setVideoPreview(null);

      if (onProductCreated) {
        setTimeout(() => onProductCreated(), 1000);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
          background-size: 1000px 100%;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Basic Information</h3>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter a compelling title for your artwork"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your product in detail - materials used, techniques, inspiration..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
              required
            />
            <p className="text-xs text-slate-500">
              {description.length} characters • Be detailed to help buyers understand your work
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Type Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Product Type</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subcategoryOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSubcategory(option.value)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  subcategory === option.value
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{option.label}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{option.desc}</div>
                  </div>
                  {subcategory === option.value && (
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Fields Based on Subcategory */}
        {subcategory && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Product Specifications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quantity */}
              {needsQuantity && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Quantity Available <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter available quantity"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
                    required
                    min="1"
                  />
                </div>
              )}

              {/* Size */}
              {needsSize && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Size/Dimensions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 24x36 inches, A4, 30cm"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              )}

              {/* Weight */}
              {needsWeight && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Weight <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 500g, 2kg, 1.5lb"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              )}

              {/* Fragile */}
              {needsFragile && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Special Handling
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isFragile}
                      onChange={e => setIsFragile(e.target.checked)}
                      className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-medium text-slate-900">Fragile Item</div>
                      <div className="text-xs text-slate-600">Requires special packaging and handling</div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Upload Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Product Media</h3>
          </div>

          {/* Images Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700">
                Product Images <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                {images.length} {images.length === 1 ? 'image' : 'images'} selected
              </span>
            </div>

            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-pink-500 hover:bg-pink-50/50 transition-all">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm font-medium text-slate-700 mb-1">Click to upload images</p>
                  <p className="text-xs text-slate-500">PNG, JPG, WebP up to 10MB each</p>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Product Video <span className="text-slate-500 font-normal">(Optional)</span>
            </label>

            {!video ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-pink-500 hover:bg-pink-50/50 transition-all">
                  <div className="text-center">
                    <svg className="w-10 h-10 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-slate-700 mb-1">Upload a product video</p>
                    <p className="text-xs text-slate-500">MP4, MOV up to 50MB</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-64 object-cover rounded-xl border-2 border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t-2 border-slate-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Uploading Product... {uploadProgress}%
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Add Product to Store
              </>
            )}
          </button>

          {isSubmitting && uploadProgress > 0 && (
            <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}