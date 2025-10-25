import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-secondary py-20" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-text mb-6">
                Handcrafted Cakes Made with Love
              </h1>
              <p className="text-xl md:text-2xl text-text mb-8 font-secondary max-w-2xl mx-auto">
                Indulge in our delicious selection of premium cakes, baked fresh daily with the finest ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/products" className="btn btn-accent text-lg px-8 py-4">
                  Browse Our Cakes
                </Link>
                <Link href="/about" className="btn btn-outline text-lg px-8 py-4">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="features-heading" className="text-3xl font-bold text-center mb-12">
              Why Choose Sweet Dreams?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-8 text-center">
                <div className="text-5xl mb-4" aria-hidden="true">🎂</div>
                <h3 className="text-xl font-semibold mb-3">Premium Ingredients</h3>
                <p className="text-gray-600 font-secondary">
                  We use only the finest, freshest ingredients to create our delicious cakes.
                </p>
              </div>
              <div className="card p-8 text-center">
                <div className="text-5xl mb-4" aria-hidden="true">👨‍🍳</div>
                <h3 className="text-xl font-semibold mb-3">Expert Bakers</h3>
                <p className="text-gray-600 font-secondary">
                  Our experienced pastry chefs bring years of expertise to every creation.
                </p>
              </div>
              <div className="card p-8 text-center">
                <div className="text-5xl mb-4" aria-hidden="true">🚚</div>
                <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                <p className="text-gray-600 font-secondary">
                  Get your cakes delivered fresh to your doorstep within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white" aria-labelledby="categories-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="categories-heading" className="text-3xl font-bold text-center mb-12">
              Explore Our Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Chocolate', emoji: '🍫', link: '/products?category=Chocolate' },
                { name: 'Fruit', emoji: '🍓', link: '/products?category=Fruit' },
                { name: 'Classic', emoji: '🎂', link: '/products?category=Classic' },
                { name: 'Coffee', emoji: '☕', link: '/products?category=Coffee' },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={category.link}
                  className="card p-8 text-center hover:scale-105 transition-transform"
                  aria-label={`Browse ${category.name} cakes`}
                >
                  <div className="text-6xl mb-4" aria-hidden="true">{category.emoji}</div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-secondary to-accent" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-4xl font-bold text-text mb-6">
              Ready to Order Your Perfect Cake?
            </h2>
            <p className="text-xl text-text mb-8 font-secondary">
              Browse our collection and find the perfect cake for your special occasion.
            </p>
            <Link href="/products" className="btn btn-primary text-lg px-8 py-4 inline-block">
              Shop Now
            </Link>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  text: 'The chocolate cake was absolutely divine! Perfect for my birthday celebration.',
                  rating: 5,
                },
                {
                  name: 'Mike Chen',
                  text: 'Best cakes in town! The quality and taste are unmatched.',
                  rating: 5,
                },
                {
                  name: 'Emily Davis',
                  text: 'Beautiful presentation and delicious taste. Highly recommend!',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div key={index} className="card p-6">
                  <div className="flex items-center mb-4" aria-label={`${testimonial.rating} star rating`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-accent text-xl" aria-hidden="true">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 font-secondary mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
