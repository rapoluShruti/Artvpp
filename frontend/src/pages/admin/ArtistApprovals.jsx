import { useEffect, useState } from "react";
import api from "../../api";

export default function ArtistApprovals() {

  const [artists, setArtists] = useState([]);

  useEffect(() => {
    api.get("/artists/pending").then((res) => {
      setArtists(res.data || []);
    });
  }, []);

  const approve = async (id) => {
    await api.put(`/artists/approve/${id}`);
    alert("Artist Approved ✅");
    setArtists((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="mb-10 text-white">
          <h2 className="text-4xl font-extrabold mb-2">
            Pending Artist Approvals
          </h2>
          <p className="text-white/70">
            Review and approve artists requesting access
          </p>
        </div>

        {/* EMPTY STATE */}
        {artists.length === 0 && (
          <div className="text-center text-white py-24">
            <p className="text-xl text-white/80">
              No pending artists 🎉
            </p>
          </div>
        )}

        {/* ARTISTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {artists.map((a) => (
            <div
              key={a.id}
              className="bg-white/15 backdrop-blur-xl rounded-2xl
              shadow-xl hover:shadow-2xl transition-all p-6"
            >

              {/* INFO */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">
                  {a.display_name}
                </h3>

                <p className="text-white/70">
                  {a.specialization}
                </p>
              </div>

              {/* ACTION */}
              <button
                onClick={() => approve(a.id)}
                className="px-6 py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r from-green-400 to-emerald-500
                hover:scale-[1.05] transition-transform"
              >
                Approve Artist
              </button>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
