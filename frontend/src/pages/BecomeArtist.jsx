import { useState } from "react";
import api from "../api";
import { useNavigate } from 'react-router-dom';

export default function BecomeArtist() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/artists/apply", {
        display_name: displayName,
        bio,
        specialization,
        portfolio_link: portfolio
      });
      alert("Application submitted");
      navigate('/artist/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black">Apply to be an Artist</h1>
          <p className="text-gray-600 mt-2">Tell us about your work and portfolio</p>
        </div>

        <form onSubmit={submit} className="bg-white border-2 border-black rounded-lg p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-black mb-2">Display name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none"
              placeholder="Your public name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Short bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none h-28"
              placeholder="Describe your art, style, and experience"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Specialization</label>
            <input
              value={specialization}
              onChange={e => setSpecialization(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none"
              placeholder="e.g. Painter, Illustrator"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Portfolio link</label>
            <input
              value={portfolio}
              onChange={e => setPortfolio(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/')} className="flex-1 px-4 py-3 border-2 border-black rounded-lg font-bold">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-black text-white font-bold rounded-lg">
              {loading ? 'Submitting...' : 'Apply to Become Artist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
