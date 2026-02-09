import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getUserFromToken } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      const user = getUserFromToken();

      // route by role; for artists check profile state
      if (user.role === "admin") {
        navigate("/dashboard/admin");
        return;
      }

      if (user.role === "customer") {
        navigate("/dashboard/customer");
        return;
      }

      if (user.role === "artist") {
        try {
          const prof = await api.get('/artist-profile/me');
          const profile = prof.data;
          if (!profile) {
            // no profile yet, ask to apply
            navigate('/artist/become');
            return;
          }
          if (profile.status && (profile.status === 'pending' || profile.status === 'incomplete')) {
            // still pending or incomplete -> onboarding
            navigate('/artist/onboarding');
            return;
          }
          // approved/active -> artist dashboard
          navigate('/artist/dashboard');
          return;
        } catch (e) {
          // fallback
          navigate('/artist/dashboard');
          return;
        }
      }

      // default
      navigate('/');

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const res = await api.post("/auth/google", {
        name: "Google User",
        email: "googleuser@gmail.com"
      });

      localStorage.setItem("token", res.data.token);

      const user = getUserFromToken();
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
        return;
      }
      if (user.role === 'customer') {
        navigate('/dashboard/customer');
        return;
      }
      if (user.role === 'artist') {
        try {
          const prof = await api.get('/artist-profile/me');
          const profile = prof.data;
          if (!profile) { navigate('/artist/become'); return; }
          if (profile.status && (profile.status === 'pending' || profile.status === 'incomplete')) { navigate('/artist/onboarding'); return; }
          navigate('/artist/dashboard');
          return;
        } catch (e) {
          navigate('/artist/dashboard');
          return;
        }
      }
      navigate('/');

    } catch {
      alert("Google login failed");
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
            <h1 className="text-2xl font-bold">KALAVPP</h1>
          </div>

          <h2 className="text-center text-2xl font-semibold">
            Sign in to your account
          </h2>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={handleGoogleLogin}
              className="py-2.5 rounded-md bg-black text-white font-bold hover:bg-gray-800"
            >
              Sign in with Google
            </button>

            <button
              className="py-2.5 rounded-md bg-white border-2 border-black font-bold hover:bg-gray-100"
            >
              Sign in with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-gray-500 text-sm">
                OR
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-black text-white rounded-md font-bold hover:bg-gray-800"
            >
              Sign in
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
