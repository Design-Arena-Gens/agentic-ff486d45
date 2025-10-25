import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-4 font-secondary">
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <address className="not-italic text-gray-600">
                    123 Bakery Street<br />
                    Sweet City, SC 12345
                  </address>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">
                    <a href="tel:+15551234567" className="hover:text-primary transition-colors">
                      (555) 123-4567
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:info@sweetdreams.com" className="hover:text-primary transition-colors">
                      info@sweetdreams.com
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 5:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-gray-600 font-secondary mb-4">
                Have a question or special request? We'd love to hear from you!
              </p>
              <p className="text-gray-600 font-secondary">
                Please email us at{' '}
                <a href="mailto:info@sweetdreams.com" className="text-primary hover:underline">
                  info@sweetdreams.com
                </a>{' '}
                or call us at{' '}
                <a href="tel:+15551234567" className="text-primary hover:underline">
                  (555) 123-4567
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
