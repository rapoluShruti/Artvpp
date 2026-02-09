export default function FeaturesGrid() {
  const features = [
    "Zoom Product Images",
    "Instant Digital Downloads",
    "Custom Art Orders",
    "Negotiation Based Services",
    "Artist Portfolios",
    "Secure Payments",
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl text-center font-bold">Features</h2>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {features.map((f, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded text-center">
            {f}
          </div>
        ))}
      </div>
    </section>
  );
}
