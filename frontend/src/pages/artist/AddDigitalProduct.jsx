// import {useState, useEffect} from "react";
// import api from "../../api";

// export default function AddDigitalProduct(){

//   const [title,setTitle]=useState("");
//   const [desc,setDesc]=useState("");
//   const [price,setPrice]=useState("");
//   const [categoryId,setCategoryId]=useState("");
//   const [type,setType]=useState("zip");
//   const [categories,setCategories]=useState([]);

//   const [preview,setPreview]=useState(null);
//   const [file,setFile]=useState(null);

//   const [chain,setChain]=useState("");
//   const [contract,setContract]=useState("");
//   const [token,setToken]=useState("");

//   useEffect(() => {
//     api.get("/categories")
//       .then(res => setCategories(res.data || []))
//       .catch(err => console.error("Error loading categories:", err));
//   }, []);

//   const submit = async ()=>{
//     if(!title || !desc || !price || !categoryId || !preview){
//       alert("Please fill all required fields and add preview image");
//       return;
//     }

//     if(type !== "nft" && !file){
//       alert("Please select the asset file");
//       return;
//     }

//     try {
//       const fd = new FormData();
//       fd.append("title",title);
//       fd.append("description",desc);
//       fd.append("price",parseFloat(price));
//       fd.append("category_id",categoryId);
//       fd.append("asset_type",type);
//       fd.append("preview",preview);

//       if(type==="nft"){
//         fd.append("nft_chain",chain);
//         fd.append("nft_contract",contract);
//         fd.append("nft_token_id",token);
//       }else{
//         fd.append("file",file);
//       }

//       console.log("Uploading digital product...");
//       const res = await api.post("/digital",fd);
      
//       console.log("Response:", res.data);
//       alert("Digital product uploaded successfully!");
      
//       // Reset form
//       setTitle("");
//       setDesc("");
//       setPrice("");
//       setCategoryId("");
//       setType("zip");
//       setPreview(null);
//       setFile(null);
//       setChain("");
//       setContract("");
//       setToken("");

//     } catch(err) {
//       console.error("Upload error:", err);
//       alert(err.response?.data?.error || err.message || "Error uploading product");
//     }
//   };

//   return(
//     <div className="p-6 max-w-xl border rounded bg-gray-50">

//       <h2 className="text-xl font-bold mb-4">Add Digital Product</h2>

//       <input placeholder="Title"
//         value={title}
//         className="border p-2 w-full mb-2"
//         onChange={e=>setTitle(e.target.value)}
//       />

//       <textarea placeholder="Description"
//         value={desc}
//         className="border p-2 w-full mb-2"
//         onChange={e=>setDesc(e.target.value)}
//       />

//       <input placeholder="Price"
//         value={price}
//         className="border p-2 w-full mb-2"
//         onChange={e=>setPrice(e.target.value)}
//       />

//       <select 
//         value={categoryId}
//         className="border p-2 w-full mb-2"
//         onChange={e=>setCategoryId(e.target.value)}>
//         <option value="">Select Category</option>
//         {categories.map(cat => (
//           <option key={cat.id} value={cat.id}>{cat.name}</option>
//         ))}
//       </select>

//       <select 
//         value={type}
//         className="border p-2 w-full mb-2"
//         onChange={e=>setType(e.target.value)}>

//         <option value="zip">ZIP (Templates, Stock, Fonts)</option>
//         <option value="pdf">PDF (Book/Zine)</option>
//         <option value="nft">NFT</option>

//       </select>

//       <p className="mt-4 font-medium">Preview Image *</p>
//       <input type="file"
//         accept="image/*"
//         className="border p-2 w-full mb-2"
//         onChange={e=>setPreview(e.target.files[0])}
//       />

//       {type !== "nft" && (
//         <>
//           <p className="mt-4 font-medium">Main File *</p>
//           <input type="file"
//             className="border p-2 w-full mb-2"
//             onChange={e=>setFile(e.target.files[0])}
//           />
//         </>
//       )}

//       {type === "nft" && (
//         <>
//           <p className="mt-4 font-medium">NFT Details</p>
//           <input placeholder="Blockchain (e.g., ethereum)"
//             value={chain}
//             className="border p-2 w-full mb-2"
//             onChange={e=>setChain(e.target.value)}
//           />
//           <input placeholder="Contract Address"
//             value={contract}
//             className="border p-2 w-full mb-2"
//             onChange={e=>setContract(e.target.value)}
//           />
//           <input placeholder="Token ID"
//             value={token}
//             className="border p-2 w-full mb-2"
//             onChange={e=>setToken(e.target.value)}
//           />
//         </>
//       )}

//       <button onClick={submit}
//         className="bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full font-bold">
//         Upload Digital Product
//       </button>

//     </div>
//   );
// }
import { useState, useEffect } from "react";
import api from "../../api";

export default function AddDigitalProduct({ onProductCreated }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("zip");
  const [categories, setCategories] = useState([]);

  const [preview, setPreview] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [chain, setChain] = useState("");
  const [contract, setContract] = useState("");
  const [token, setToken] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data || []))
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  const assetTypes = [
    { 
      value: "zip", 
      label: "ZIP Archive", 
      icon: "📦",
      desc: "Templates, fonts, stock assets",
      examples: "Design templates, font packs, stock photos"
    },
    { 
      value: "pdf", 
      label: "PDF Document", 
      icon: "📄",
      desc: "E-books, guides, zines",
      examples: "E-books, tutorials, magazines"
    },
    { 
      value: "nft", 
      label: "NFT", 
      icon: "🎨",
      desc: "Blockchain-based digital art",
      examples: "Digital collectibles, crypto art"
    },
  ];

  const blockchains = [
    { value: "ethereum", label: "Ethereum", icon: "⟠" },
    { value: "polygon", label: "Polygon", icon: "◆" },
    { value: "solana", label: "Solana", icon: "◎" },
    { value: "binance", label: "Binance Smart Chain", icon: "◈" },
  ];

  const handlePreviewChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const removePreview = () => {
    setPreview(null);
    setPreviewUrl(null);
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
  };

  const submit = async () => {
    if (!title || !desc || !price || !categoryId || !preview) {
      alert("Please fill all required fields and add preview image");
      return;
    }

    if (type !== "nft" && !file) {
      alert("Please select the asset file");
      return;
    }

    if (type === "nft" && (!chain || !contract || !token)) {
      alert("Please fill all NFT details");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", desc);
      fd.append("price", parseFloat(price));
      fd.append("category_id", categoryId);
      fd.append("asset_type", type);
      fd.append("preview", preview);

      if (type === "nft") {
        fd.append("nft_chain", chain);
        fd.append("nft_contract", contract);
        fd.append("nft_token_id", token);
      } else {
        fd.append("file", file);
      }

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

      const res = await api.post("/digital", fd);

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
          <div class="font-semibold">Digital Product Added!</div>
          <div class="text-sm opacity-90">Your product is now available</div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      // Reset form
      setTitle("");
      setDesc("");
      setPrice("");
      setCategoryId("");
      setType("zip");
      setPreview(null);
      setPreviewUrl(null);
      setFile(null);
      setFileName("");
      setChain("");
      setContract("");
      setToken("");

      if (onProductCreated) {
        setTimeout(() => onProductCreated(), 1000);
      }

    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.error || err.message || "Error uploading product");
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
      `}</style>

      <div className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Product Information</h3>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter a compelling title for your digital product"
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
              placeholder="Describe your digital product - what's included, file formats, usage rights..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
              required
            />
            <p className="text-xs text-slate-500">
              {desc.length} characters • Be specific about what buyers will receive
            </p>
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* Asset Type Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Asset Type</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assetTypes.map(assetType => (
              <button
                key={assetType.value}
                type="button"
                onClick={() => setType(assetType.value)}
                className={`p-5 border-2 rounded-xl text-left transition-all ${
                  type === assetType.value
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{assetType.icon}</span>
                    {type === assetType.value && (
                      <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="font-semibold text-slate-900 mb-1">{assetType.label}</div>
                  <div className="text-xs text-slate-600 mb-2">{assetType.desc}</div>
                  <div className="text-xs text-slate-500 mt-auto">
                    <span className="font-medium">Examples:</span> {assetType.examples}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Image Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Preview Image</h3>
          </div>

          {!preview ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 hover:border-pink-500 hover:bg-pink-50/50 transition-all">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-semibold text-slate-700 mb-2">Upload Preview Image</p>
                  <p className="text-sm text-slate-500">This will be shown to customers before purchase</p>
                  <p className="text-xs text-slate-400 mt-2">PNG, JPG, WebP up to 10MB</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePreviewChange}
                className="hidden"
                required
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl border-2 border-slate-200"
              />
              <button
                type="button"
                onClick={removePreview}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Conditional Sections Based on Type */}
        {type !== "nft" ? (
          /* File Upload for ZIP/PDF */
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Product File</h3>
            </div>

            {!file ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-700 mb-2">
                      Upload Your {type.toUpperCase()} File
                    </p>
                    <p className="text-sm text-slate-500">
                      This is the actual product file customers will download
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {type === "zip" ? "ZIP files up to 100MB" : "PDF files up to 50MB"}
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept={type === "zip" ? ".zip" : ".pdf"}
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            ) : (
              <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{fileName}</p>
                      <p className="text-sm text-slate-600">
                        {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'File ready'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* NFT Details */
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">NFT Blockchain Details</h3>
            </div>

            {/* Blockchain Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Blockchain Network <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {blockchains.map(blockchain => (
                  <button
                    key={blockchain.value}
                    type="button"
                    onClick={() => setChain(blockchain.value)}
                    className={`p-4 border-2 rounded-xl text-left transition-all flex items-center gap-3 ${
                      chain === blockchain.value
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl">{blockchain.icon}</span>
                    <span className="font-medium text-slate-900">{blockchain.label}</span>
                    {chain === blockchain.value && (
                      <svg className="w-5 h-5 text-amber-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Contract Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Smart Contract Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={contract}
                onChange={e => setContract(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono text-sm placeholder:text-slate-400"
                required
              />
            </div>

            {/* Token ID */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Token ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter NFT token ID"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t-2 border-slate-200">
          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Uploading Digital Product... {uploadProgress}%
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Digital Product
              </>
            )}
          </button>

          {isSubmitting && uploadProgress > 0 && (
            <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}