
import React, { useState } from "react";
import api from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      alert("Registration successful");
      console.log(res.data);

    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-start justify-center pt-20 px-4">

        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <h1 className="text-2xl font-bold text-black">KALAVPP</h1>
          </div>

          <h2 className="text-center text-2xl font-semibold">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="mt-8">

            <div className="mb-4">
              <label className="text-sm">Account Type</label>
              <div className="mt-2 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="role" value="customer" checked={role==="customer"} onChange={() => setRole("customer")} />
                  <span className="text-sm">Customer</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="role" value="artist" checked={role==="artist"} onChange={() => setRole("artist")} />
                  <span className="text-sm">Artist</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create account
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
