import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white mt-16 border-t border-gray-200" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sweet Dreams Cake Shop</h3>
            <p className="text-gray-600 font-secondary">
              Handcrafted cakes made with love and the finest ingredients.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">
                    Shop Cakes
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="not-italic text-gray-600 font-secondary">
              <p>123 Bakery Street</p>
              <p>Sweet City, SC 12345</p>
              <p className="mt-2">
                <a href="tel:+15551234567" className="hover:text-primary transition-colors">
                  (555) 123-4567
                </a>
              </p>
              <p>
                <a href="mailto:info@sweetdreams.com" className="hover:text-primary transition-colors">
                  info@sweetdreams.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 font-secondary">
          <p>&copy; {new Date().getFullYear()} Sweet Dreams Cake Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
