import { useState } from "react";
import api from "../../api";

export default function AddVariants({ productId, productData, onVariantAdded }) {

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);

  const handleAddVariant = async () => {
    if (!color || !size || !price || !quantity || images.length === 0) {
      alert("Please fill all variant fields and add images");
      return;
    }

    if (parseFloat(price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (parseFloat(quantity) <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (images.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("color", color);
      formData.append("size", size);
      formData.append("price", parseFloat(price));
      formData.append("quantity", parseFloat(quantity));

      images.forEach(img => formData.append("images", img));

      const response = await api.post("/merchandise/variant", formData);

      console.log("Variant added:", response.data);
      alert("Variant added successfully!");
      setColor("");
      setSize("");
      setPrice("");
      setQuantity("");
      setImages([]);
      onVariantAdded();

    } catch (err) {
      console.error("Error adding variant:", err);
      alert(err.response?.data?.error || err.response?.data?.message || err.message || "Error adding variant");
    }
  };

  return (
    <div className="border p-6 rounded bg-blue-50">
      <h3 className="text-2xl font-bold mb-4">Add Variant for: {productData?.title}</h3>

      <input
        placeholder="Color"
        value={color}
        className="border p-2 w-full mb-2"
        onChange={e => setColor(e.target.value)}
      />

      <input
        placeholder="Size"
        value={size}
        className="border p-2 w-full mb-2"
        onChange={e => setSize(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        className="border p-2 w-full mb-2"
        onChange={e => setPrice(e.target.value)}
      />

      <input
        placeholder="Quantity"
        value={quantity}
        className="border p-2 w-full mb-2"
        onChange={e => setQuantity(e.target.value)}
      />

      <input
        type="file"
        multiple
        accept="image/*"
        className="mb-3"
        onChange={e => setImages([...e.target.files])}
      />

      <button
        onClick={handleAddVariant}
        className="bg-green-600 text-white px-4 py-2"
      >
        Add Variant
      </button>
    </div>
  );
}
