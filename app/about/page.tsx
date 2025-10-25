import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center mb-8">About Sweet Dreams</h1>
          
          <div className="card p-8 mb-8">
            <p className="text-lg font-secondary mb-6 leading-relaxed">
              Welcome to Sweet Dreams Cake Shop, where every cake tells a story and every bite is a celebration. 
              Since 2015, we've been crafting exceptional custom cakes that bring joy to life's most precious moments.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-lg font-secondary mb-6 leading-relaxed">
              Founded by passionate baker Maria Rodriguez, Sweet Dreams began as a small home bakery with a big dream: 
              to create beautiful, delicious cakes that make every occasion unforgettable. Today, we're proud to serve 
              our community with handcrafted cakes made from the finest ingredients.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <ul className="space-y-3 mb-6 font-secondary text-lg">
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span><strong>Quality First:</strong> We use only premium, fresh ingredients in every recipe.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span><strong>Handcrafted with Love:</strong> Each cake is individually crafted by our skilled bakers.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span><strong>Customer Satisfaction:</strong> Your happiness is our top priority.</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span><strong>Sustainability:</strong> We source locally whenever possible and minimize waste.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
