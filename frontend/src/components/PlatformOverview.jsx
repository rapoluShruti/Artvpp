export default function PlatformOverview() {
  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold">Two Powerful Platforms</h2>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-xl">ArtCommerce</h3>
          <p>Physical, Digital & Custom Art Products</p>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-xl">Creative Services</h3>
          <p>Hire Artists Like Fiverr</p>
        </div>
      </div>
    </section>
  );
}
