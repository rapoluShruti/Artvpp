export default function Footer() {
  return (
    <footer className="bg-white text-black py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">ArtVPP</h3>
            <p className="text-black/80 leading-relaxed">
              Your premier destination for digital art, commissions, and creative inspiration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-black/80 hover:text-black transition">Browse Art</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">Commission</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">Artists</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">Marketplace</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-black/80 hover:text-black transition">Help Center</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">FAQs</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">Contact Us</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-black/80 hover:text-black transition">Twitter</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">Instagram</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">Discord</a></li>
              <li><a href="#" className="text-black/80 hover:text-black transition">Newsletter</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/20 mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-black/70 text-sm">
            © 2025 ArtVPP. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-black/70 hover:text-black transition">Privacy Policy</a>
            <a href="#" className="text-black/70 hover:text-black transition">Cookie Policy</a>
            <a href="#" className="text-black/70 hover:text-black transition">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}