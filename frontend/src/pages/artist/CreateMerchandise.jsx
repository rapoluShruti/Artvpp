import { useState, useEffect } from "react";
import api from "../../api";

export default function CreateMerchandise({ onProductCreated }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data || []))
      .catch(err => {
        console.error("Error loading categories:", err);
        alert("Error loading categories");
      });
  }, []);

  const handleCreate = async () => {
    if (!title || !description || !categoryId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await api.post("/merchandise", {
        title,
        description,
        category_id: categoryId
      });

      alert("Product created!");
      setTitle("");
      setDescription("");
      setCategoryId("");
      onProductCreated();

    } catch (err) {
      console.error("Error creating product:", err);
      alert(err.response?.data?.message || err.message || "Error creating product");
    }
  };

  return (
    <div className="border p-6 rounded mb-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Create Merchandise Product</h2>

      <input
        placeholder="Product Title"
        value={title}
        className="border p-2 w-full mb-3"
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        className="border p-2 w-full mb-3"
        onChange={e => setDescription(e.target.value)}
      />

      <select
        value={categoryId}
        className="border p-2 w-full mb-3"
        onChange={e => setCategoryId(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Create Product
      </button>
    </div>
  );
}
