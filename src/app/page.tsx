

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-poppins bg-white text-gray-900">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50 shadow">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center w-full">
            <a href="#" className="flex items-center gap-2 text-xl font-bold">
              <Image src="/images/logo.png" alt="AddisMenu Logo" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="hidden sm:inline">AddisMenu</span>
            </a>
            <ul className="hidden md:flex ml-10 gap-8 text-base font-medium items-center">
              <li><a href="#features" className="hover:text-blue-400 transition">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400 transition">Process</a></li>
              <li><a href="#demo" className="hover:text-blue-400 transition">Demo</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition">Contact</a></li>
              <li>
                <Link href="/menu" className="hover:text-blue-500 font-semibold transition">
                  View Menu
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-blue-500 font-semibold transition px-4 py-2 rounded border border-blue-500 ml-2">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded ml-2 transition">
                  Get Started
                </Link>
              </li>
            </ul>
            <a href="#contact" className="call-order-btn ml-auto hidden md:inline-block bg-gradient-to-r from-blue-500 to-yellow-300 text-white font-bold text-base rounded-full px-7 py-2 shadow hover:from-yellow-300 hover:to-blue-500 transition">Call for Order</a>
            <div className="md:hidden ml-auto text-2xl cursor-pointer">
              <i className="fas fa-bars"></i>
            </div>
            {/* Mobile menu button could be extended to include menu link if needed */}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero bg-gradient-to-br from-blue-50 to-yellow-50 py-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Modernize Your Restaurant with Digital Menus</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-4">Beautiful, functional menus that enhance customer experience and boost your sales</p>
            <div className="flex gap-4">
              <a href="#demo" className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow">View Demo</a>
              <a href="#contact" className="btn btn-outline border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold px-6 py-3 rounded-full transition">Get Started</a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <Image src="/images/hero-devices.png" alt="Digital Menu on Devices" width={400} height={320} className="object-contain max-h-80" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Our Powerful Features</h2>
          <p className="text-lg text-gray-600 mb-10 text-center">Everything you need to modernize your restaurant&apos;s menu</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <FeatureCard icon="fa-qrcode" title="QR Code Menu" desc="Customers access your menu instantly by scanning a QR code at their table." />
            <FeatureCard icon="fa-sync-alt" title="Real-Time Updates" desc="Change menu items or prices instantly from our admin dashboard." />
            <FeatureCard icon="fa-images" title="Dish Photography" desc="Professional food photography to showcase your menu items." />
            <FeatureCard icon="fa-language" title="Multi-Language" desc="Offer your menu in multiple languages for international guests." />
            <FeatureCard icon="fa-chart-line" title="Menu Analytics" desc="Track which items customers view most to optimize your menu." />
            <FeatureCard icon="fa-mobile-alt" title="Mobile Optimized" desc="Looks perfect on any device - phones, tablets or desktops." />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">How It Works</h2>
          <p className="text-lg text-gray-600 mb-10 text-center">Simple steps to get your digital menu live</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard number={1} title="Contact Us" desc="Get in touch to discuss your restaurant's needs and requirements." />
            <StepCard number={2} title="Account Setup" desc="We create your restaurant's admin dashboard and gather menu data." />
            <StepCard number={3} title="Menu Design" desc="Our team designs your digital menu to match your brand identity." />
            <StepCard number={4} title="Go Live" desc="We deliver QR codes and help you implement the digital menu." />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">See It In Action</h2>
          <p className="text-lg text-gray-600 mb-10 text-center">Experience our digital menu solution</p>
          <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
            <div className="flex gap-8">
              <div className="device phone bg-gray-100 rounded-xl shadow p-4">
                <Image src="/images/phone-mockup.png" alt="Phone Demo" width={120} height={240} className="object-contain" />
              </div>
              <div className="device tablet bg-gray-100 rounded-xl shadow p-4">
                <Image src="/images/tablet-mockup.png" alt="Tablet Demo" width={180} height={240} className="object-contain" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <a href="demo.html" className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow">Interactive Demo</a>
              <p className="text-gray-600">Scan to view on your phone</p>
              <Image src="/images/demo-qr.png" alt="Demo QR Code" width={120} height={120} className="demo-qr" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 mb-10 text-center">Restaurants using AddisMenu</p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <TestimonialCard
              active
              content="AddisMenu transformed our restaurant's customer experience. The digital menu is sleek, professional and our guests love it!"
              authorImg="/images/client1.jpg"
              authorName="Samuel G."
              authorTitle="Owner, Addis Ababa Restaurant"
            />
            <TestimonialCard
              content="Updating our menu used to be expensive and time-consuming. Now with AddisMenu, changes are instant and cost nothing."
              authorImg="/images/client2.jpg"
              authorName="Meron T."
              authorTitle="Manager, Habesha Cafe"
            />
          </div>
          <div className="flex justify-center mt-6 gap-2">
            <span className="dot w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
            <span className="dot w-3 h-3 rounded-full bg-gray-300 inline-block"></span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta py-16 bg-gradient-to-r from-blue-500 to-yellow-300 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Ready to Upgrade Your Menu?</h2>
          <p className="text-lg mb-6">Contact us today to get started with your digital menu solution</p>
          <a href="#contact" className="btn btn-primary bg-white text-blue-500 font-semibold px-8 py-3 rounded-full shadow hover:bg-blue-100 transition">Get Started Now</a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact py-16 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
            <p className="text-lg text-gray-600 mb-6">We&#39;ll create your digital menu</p>
            <form className="contact-form grid grid-cols-1 gap-4">
              <input type="text" placeholder="Your Name" required className="form-input px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="email" placeholder="Your Email" required className="form-input px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="text" placeholder="Restaurant Name" required className="form-input px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="tel" placeholder="Phone Number" required className="form-input px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <textarea placeholder="Tell us about your menu needs" rows={5} required className="form-textarea px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <button type="submit" className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow">Request Demo</button>
            </form>
          </div>
          <div className="flex-1 flex flex-col gap-6 justify-center">
            <div className="flex items-center gap-4">
              <i className="fas fa-envelope text-blue-500 text-2xl"></i>
              <p>contact@addismenu.com</p>
            </div>
            <div className="flex items-center gap-4">
              <i className="fas fa-phone text-blue-500 text-2xl"></i>
              <p>+251988004333</p>
            </div>
            <div className="flex items-center gap-4">
              <i className="fas fa-map-marker-alt text-blue-500 text-2xl"></i>
              <p>4 kilo, Addis Ababa, Ethiopia</p>
            </div>
            <div className="flex gap-4 mt-2">
              <a href="#" title="Facebook" className="text-gray-500 hover:text-blue-500 text-xl"><i className="fab fa-facebook-f"></i></a>
              <a href="#" title="Facebook" className="text-gray-500 hover:text-blue-500 text-xl"><i className="fab fa-facebook-f"></i></a>
              <a href="#" title="Twitter" className="text-gray-500 hover:text-blue-500 text-xl"><i className="fab fa-twitter"></i></a>
              <a href="#" title="Instagram" className="text-gray-500 hover:text-blue-500 text-xl"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-black text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-2">AddisMenu</h3>
              <p className="mb-4">Professional digital menu solutions for restaurants and hotels.</p>
              <div className="footer-logo">
                <Image src="/images/logo-white.png" alt="AddisMenu Logo" width={80} height={40} className="object-contain" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li><a href="#features" className="hover:text-blue-400 transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-400 transition">How It Works</a></li>
                <li><a href="#demo" className="hover:text-blue-400 transition">Demo</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Services</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-blue-400 transition">Digital Menu Creation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Menu Photography</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">QR Code Setup</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Menu Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center border-t border-gray-800 pt-6 text-sm">
            <p>&copy; 2023 powered by Viavela Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="feature-card bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center text-center gap-4">
      <div className="feature-icon text-3xl text-blue-500 mb-2">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

// Step Card Component
function StepCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="step flex flex-col items-center text-center gap-3">
      <div className="step-number w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold mb-2">{number}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ active, content, authorImg, authorName, authorTitle }: { active?: boolean; content: string; authorImg: string; authorName: string; authorTitle: string }) {
  return (
    <div className={`testimonial bg-white rounded-xl shadow p-6 max-w-md flex flex-col gap-4 ${active ? 'border-2 border-blue-400' : ''}`}>
      <div className="testimonial-content text-gray-700 italic">&quot;{content}&quot;</div>
      <div className="testimonial-author flex items-center gap-4 mt-2">
        <Image src={authorImg} alt="Client" width={48} height={48} className="rounded-full object-cover" />
        <div className="author-info">
          <h4 className="font-semibold">{authorName}</h4>
          <p className="text-sm text-gray-500">{authorTitle}</p>
        </div>
      </div>
    </div>
  );
}
