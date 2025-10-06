'use client';

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { useAnimateOnScroll } from "../components/useAnimateOnScroll";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const heroRef = useAnimateOnScroll("fade-up");
  const howItWorksRef = useAnimateOnScroll("fade-up");
  const featuresRef = useAnimateOnScroll("fade-up");
  const pricingRef = useAnimateOnScroll("fade-up");
  const footerRef = useAnimateOnScroll("fade-up");

  return (
    <div className="antialiased bg-neutral-50 text-neutral-900 font-sans min-h-screen">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 shadow-sm px-6 py-4 flex justify-between items-center bg-black text-white">
        <Link href="/" className="text-white text-2xl font-bold leading-none flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={48} height={48} className="h-10 w-auto rounded-2xl bg-white p-1" />
          <span className="hidden md:inline">viavela</span>
        </Link>
        <ul className="hidden lg:flex gap-8 items-center">
          <li><a className="text-base font-semibold hover:text-gray-300 transition-colors duration-200" href="#how-it-works">How it works?</a></li>
          <li><a className="text-base font-semibold hover:text-gray-300 transition-colors duration-200" href="#features">Features</a></li>
          <li><a className="text-base font-semibold hover:text-gray-300 transition-colors duration-200" href="#pricing">Pricing</a></li>
          <li><a className="text-base font-semibold hover:text-gray-300 transition-colors duration-200" href="#contact">Contact</a></li>
        </ul>
        <div className="hidden lg:flex gap-2">
          <Link href="/auth/login" className="py-2 px-6 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition">Sign In</Link>
        </div>
        <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)} title="Open menu">
          <Menu className="h-6 w-6 text-white" />
        </button>
      </nav>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex">
          <div className="w-72 bg-white h-full shadow-lg p-6 flex flex-col">
            <div className="flex items-center mb-8">
              <Link href="/" className="mr-auto text-2xl font-bold leading-none flex items-center gap-2">
                <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="h-9 w-auto" />
                viavela
              </Link>
              <button className="ml-auto text-gray-500 hover:text-blue-500" onClick={() => setSidebarOpen(false)} title="Close menu">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              <li><a className="block p-2 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded" href="#how-it-works" onClick={() => setSidebarOpen(false)}>How it works?</a></li>
              <li><a className="block p-2 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded" href="#features" onClick={() => setSidebarOpen(false)}>Features</a></li>
              <li><a className="block p-2 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded" href="#pricing" onClick={() => setSidebarOpen(false)}>Pricing</a></li>
              <li><a className="block p-2 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded" href="#contact" onClick={() => setSidebarOpen(false)}>Contact</a></li>
              <li><Link href="/auth/login" className="block p-2 text-base font-semibold text-blue-600 hover:bg-blue-50 rounded" onClick={() => setSidebarOpen(false)}>Sign In</Link></li>
            </ul>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="bg-white pt-16 pb-12 md:pt-24 md:pb-20 transition-all duration-700 opacity-0 translate-y-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2"><span className="text-blue-500">Empower Your Business with Viavela</span></h1>
            <p className="text-lg text-gray-700 mb-2">Viavela offers modern solutions for your business: NFC-enabled business cards, digital menu QR codes, and NFC menu rewriting. Seamlessly connect, share, and engage with your customers using the latest technology.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/auth/register" className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow transition">Sign up now</Link>
              <a href="tel:+251988410000" className="py-3 px-8 bg-black border-2 border-gray-800 hover:border-gray-600 text-white font-semibold rounded-2xl shadow transition">Call Us Now</a>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image src="/images/logo.png" alt="iCard Hero" width={320} height={320} className="object-contain rounded-2xl shadow-xl bg-white" />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="py-20 bg-neutral-50 transition-all duration-700 opacity-0 translate-y-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
          <div className="flex flex-col gap-6">
            <span className="text-blue-600 font-bold">How it works?</span>
            <h2 className="text-3xl md:text-4xl font-bold">Create, share & get more customers</h2>
            <p className="mb-2 text-gray-500">Register a new account, create your own digital business card, share your unique link and get more customers.</p>
            <ul className="text-gray-700 font-semibold space-y-3">
              <li className="flex items-center"><svg className="mr-2 w-6 h-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>Create business card</li>
              <li className="flex items-center"><svg className="mr-2 w-6 h-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>Share your link</li>
              <li className="flex items-center"><svg className="mr-2 w-6 h-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>Get more customers</li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <iframe className="w-full max-w-md h-64 rounded-2xl shadow-xl" src="https://www.youtube.com/embed/oDAWzHfNGMM?si=B2apHVEJxB5z4LOv" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-white transition-all duration-700 opacity-0 translate-y-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-12 max-w-md mx-auto text-center">
            <span className="text-blue-600 font-bold">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold">What viavela Offers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" /></svg>} title="Business Card NFC" desc="Share your contact instantly with NFC-enabled business cards. Just tap to connect." />
            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8v8H8z" /></svg>} title="Digital Menu QR Code" desc="Display your menu with a QR code. Customers scan and view your digital menu instantly." />
            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>} title="NFC Menu Rewrite" desc="Easily update your NFC menu cards with new information anytime." />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-20 bg-neutral-50 transition-all duration-700 opacity-0 translate-y-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-blue-600 font-bold">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold">Choose your best plan</h2>
            <p className="mb-6 text-gray-500">Good investments will give you 10x more revenue.</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <PricingCard plan="STANDARD" price="Br 4600" period="/Yearly" features={["2 viavela cards", "15 Services/Products", "10 Galleries", "Unlimited Card Features", "3 Payment Listed", "Personalized Link Available", "No Hide Branding", "Free Setup Available", "Free Support Available"]} cta="Get Started" ctaLink="/auth/register" highlight />
            <PricingCard plan="FREE" price="Free" period="/7 Days" features={["1 viavela card", "1 Service/Product", "1 Gallery", "1 Card Feature", "1 Payment Listed", "Personalized Link Available", "Hide Branding Available", "Free Setup Available", "No Free Support"]} cta="Get Started" ctaLink="/auth/register" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="bg-black pt-10 pb-4 mt-10 text-white transition-all duration-700 opacity-0 translate-y-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-left">
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">Getting Started</div>
            <a href="#how-it-works" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">How it works?</a>
            <a href="#features" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Features</a>
            <a href="#pricing" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Pricing</a>
            <a href="#faq" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">FAQs</a>
          </div>
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">My Account</div>
            <a href="/auth/login" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Login</a>
            <a href="/auth/register" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Register</a>
          </div>
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">Helpful Links</div>
            <a href="#refund-policy" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Refund Policy</a>
            <a href="mailto:info@ibex.et" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Support</a>
            <a href="#privacy-policy" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Privacy Policy</a>
            <a href="#terms" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Terms and Conditions</a>
            <a href="#videos" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Video Tutorials</a>
          </div>
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">Social Links</div>
            <a href="#" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Facebook</a>
            <a href="#" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Youtube</a>
            <a href="#" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Instagram</a>
            <a href="#" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">LinkedIn</a>
          </div>
        </div>
        <div className="pt-2 pb-2">
          <div className="flex pb-5 px-3 m-auto pt-5 border-t border-gray-700 text-gray-400 text-base flex-col md:flex-row max-w-6xl">
            <div className="mt-2">{new Date().getFullYear()} viavela. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
  // (removed extra closing brace)

  function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
      <div className="feature-card bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center text-center gap-2 min-h-[180px]">
        <div className="feature-icon mb-2">{icon}</div>
        <h3 className="text-base font-semibold mb-0.5">{title}</h3>
        <p className="text-gray-600 text-sm leading-snug">{desc}</p>
      </div>
    );
  }

  function PricingCard({ plan, price, period, features, cta, ctaLink, highlight }: { plan: string; price: string; period: string; features: string[]; cta: string; ctaLink: string; highlight?: boolean }) {
    return (
      <div className={`p-8 rounded shadow w-full max-w-xs flex flex-col items-center ${highlight ? 'bg-blue-600 text-white border-2 border-blue-700' : 'bg-white text-gray-800'}`}>
        <h4 className="mb-2 text-2xl font-bold">{plan}</h4>
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-xs ml-1">{period}</span>
        <ul className="my-4 space-y-2 text-left w-full">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link href={ctaLink} className={`mt-auto w-full text-center py-2 px-4 rounded-l-xl rounded-t-xl font-bold transition ${highlight ? 'bg-white text-blue-600 hover:bg-blue-100' : 'bg-blue-500 text-white hover:bg-blue-700'}`}>{cta}</Link>
      </div>
    );
  }

  {/* Hero Section */ }
  <section className="hero bg-gradient-to-br from-blue-50 to-cyan-50 py-8 md:py-12">
    <div className="container mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 px-2 md:px-4">
      <div className="flex-1 flex flex-col gap-3 md:gap-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-1 md:mb-2 leading-tight">Modernize Your Restaurant with Digital Menus</h1>
        <p className="text-base md:text-lg text-gray-700 mb-2 md:mb-3">Beautiful, functional menus that enhance customer experience and boost your sales</p>
        <div className="flex gap-2 md:gap-4">
          <a href="#demo" className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-full shadow">View Demo</a>
          <a href="#contact" className="btn btn-outline border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-full transition">Get Started</a>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <Image src="/images/hero-devices.png" alt="Digital Menu on Devices" width={320} height={240} className="object-contain max-h-56 md:max-h-80" />
      </div>
    </div>
  </section>

  {/* Features Section */ }
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


  {/* Demo Section */ }
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

  {/* Testimonials section removed for new landing page flow */ }

  {/* CTA Section */ }
  <section className="cta py-16 bg-gradient-to-r from-blue-500 to-cyan-300 text-white text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-2">Ready to Upgrade Your Menu?</h2>
      <p className="text-lg mb-6">Contact us today to get started with your digital menu solution</p>
      <a href="#contact" className="btn btn-primary bg-white text-blue-500 font-semibold px-8 py-3 rounded-full shadow hover:bg-blue-100 transition">Get Started Now</a>
    </div>
  </section>

  {/* Contact Section */ }
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


}
