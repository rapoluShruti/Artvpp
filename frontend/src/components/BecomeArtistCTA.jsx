import { useNavigate } from 'react-router-dom';

export default function BecomeArtistCTA() {
  const navigate = useNavigate();
  return (
    <section className="py-16 text-center bg-white border-t-2 border-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black">Are you an artist?</h2>
        <p className="mt-3 text-gray-600">Join the platform to sell your work, offer services, and reach customers.</p>
        <button
          onClick={() => navigate('/artist/become')}
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
        >
          Apply to Become an Artist
        </button>
      </div>
    </section>
  );
}
