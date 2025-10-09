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
          <span className="hidden md:inline">blinkcard</span>
        </Link>
        <ul className="hidden lg:flex gap-8 items-center">
          <li><a className="text-base font-semibold hover:text-gray-300 transition-colors duration-200" href="#how-it-works">How it works?</a></li>
          <li><a className="text-base font-semibold hover:text-gray-300 transition-colors duration-200" href="#features">Features</a></li>
          <li><a className="text-base font-semibold hover:text-gray-300 transition-colors duration-200" href="#pricing">Pricing</a></li>
          <li><a className="text-base font-semibold hover:text-gray-300 transition-colors duration-200" href="#contact-section">Contact</a></li>
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
                blinkcard
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
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2"><span className="text-blue-500">Empower Your Business with blinkcard</span></h1>
            <p className="text-lg text-gray-700 mb-2">blinkcard offers modern solutions for your business: NFC-enabled business cards, digital menu QR codes, and NFC menu rewriting. Seamlessly connect, share, and engage with your customers using the latest technology.</p>
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
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="block text-lg font-semibold text-blue-500 mb-2">How it works?</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">How blinkcard Works</h2>
            <p className="text-gray-600 text-lg">A simple step-by-step journey to get started and grow your business.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-6 min-w-[180px] max-w-xs transition-all duration-300 hover:scale-105 hover:shadow-2xl fade-up">
              <div className="mb-4">
                <span className="inline-block w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-300 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🔍</span>
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">Discover</h3>
              <p className="text-gray-600">Explore blinkcard and see how digital cards and menus can help your business.</p>
            </div>
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full mx-2" />
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-6 min-w-[180px] max-w-xs transition-all duration-300 hover:scale-105 hover:shadow-2xl fade-up">
              <div className="mb-4">
                <span className="inline-block w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📝</span>
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">Create</h3>
              <p className="text-gray-600">Sign up and easily create your digital business card or menu in minutes.</p>
            </div>
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 rounded-full mx-2" />
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-6 min-w-[180px] max-w-xs transition-all duration-300 hover:scale-105 hover:shadow-2xl fade-up">
              <div className="mb-4">
                <span className="inline-block w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-blue-300 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🚀</span>
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">Share & Grow</h3>
              <p className="text-gray-600">Share your card or menu link, attract new customers, and grow your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="relative py-24 bg-gradient-to-br from-blue-100 via-white to-purple-100 transition-all duration-700 opacity-0 translate-y-8 overflow-hidden">
        {/* Curved wave divider */}
        <div className="absolute top-0 left-0 w-full h-16 -z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="url(#offerWave)" d="M0,32L60,37.3C120,43,240,53,360,58.7C480,64,600,64,720,58.7C840,53,960,43,1080,26.7C1200,11,1320,-11,1380,-21.3L1440,-32L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z" />
            <defs>
              <linearGradient id="offerWave" x1="0" y1="0" x2="1440" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="block text-lg font-semibold text-blue-500 mb-2">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">What We Offer</h2>
            <div className="flex justify-center mb-4">
              <span className="block w-32 h-1 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-lg animate-pulse"></span>
            </div>
            <p className="text-gray-600 text-lg">Powering the next generation of digital experiences.</p>
          </div>
          {/* Responsive 3x2 grid with staggered heights, glassmorphism, gradient borders, animated hover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="relative group rounded-2xl p-6 bg-white/80 backdrop-blur-lg shadow-xl border-2 border-transparent hover:border-gradient-to-r hover:from-blue-400 hover:to-purple-400 transition-all duration-300 flex flex-col items-center justify-between min-h-[260px] hover:scale-105 hover:shadow-2xl" style={{ height: '280px' }}>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full px-4 py-1 text-xs font-bold shadow-lg">NFC</span>
              <div className="mb-4">
                <span className="text-5xl">📲</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Business Card NFC</h3>
              <p className="text-gray-600 mb-4 text-center">Share your contact instantly with NFC-enabled business cards. Just tap to connect.</p>
              <a href="#" className="text-blue-500 font-semibold hover:underline transition">Learn More</a>
            </div>
            {/* Card 2 */}
            <div className="relative group rounded-2xl p-6 bg-white/80 backdrop-blur-lg shadow-xl border-2 border-transparent hover:border-gradient-to-r hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 flex flex-col items-center justify-between min-h-[260px] hover:scale-105 hover:shadow-2xl" style={{ height: '320px' }}>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-full px-4 py-1 text-xs font-bold shadow-lg">QR</span>
              <div className="mb-4">
                <span className="text-5xl">📄</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Digital Menu QR Code</h3>
              <p className="text-gray-600 mb-4 text-center">Display your menu with a QR code. Customers scan and view your digital menu instantly.</p>
              <a href="#" className="text-blue-500 font-semibold hover:underline transition">Learn More</a>
            </div>
            {/* Card 3 */}
            <div className="relative group rounded-2xl p-6 bg-white/80 backdrop-blur-lg shadow-xl border-2 border-transparent hover:border-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300 flex flex-col items-center justify-between min-h-[260px] hover:scale-105 hover:shadow-2xl" style={{ height: '300px' }}>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full px-4 py-1 text-xs font-bold shadow-lg">NFC</span>
              <div className="mb-4">
                <span className="text-5xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">NFC Menu Rewrite</h3>
              <p className="text-gray-600 mb-4 text-center">Easily update your NFC menu cards with new information anytime.</p>
              <a href="#" className="text-blue-500 font-semibold hover:underline transition">Learn More</a>
            </div>
            {/* Add more cards here for future services, with staggered heights and animated icons */}
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
            <PricingCard plan="Business Card" price="Br 2999" period="/Yearly" features={["2 blinkcard cards", "15 Services/Products", "10 Galleries", "Unlimited Card Features", "3 Payment Listed", "Personalized Link Available", "No Hide Branding", "Free Setup Available", "Free Support Available"]} cta="Get Started" ctaLink="/auth/register" />
            <PricingCard plan="Menu" price="Br 2999" period="/Yearly" features={["2 blinkcard cards", "20 Menu Items", "10 Galleries", "Unlimited Card Features", "3 Payment Listed", "Personalized Link Available", "No Hide Branding", "Free Setup Available", "Free Support Available"]} cta="Get Started" ctaLink="/auth/register" highlight />
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Modern Contact Section - Glassmorphism, Split Layout, Animated Button, Social Icons */}
      <section id="contact-section" className="relative py-20 px-2 md:px-0 bg-gradient-to-br from-blue-50 via-white to-cyan-100 overflow-hidden">
        {/* Animated gradient waves background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="url(#waveGradient)" fillOpacity="0.3" d="M0,160L60,165.3C120,171,240,181,360,186.7C480,192,600,192,720,186.7C840,181,960,171,1080,154.7C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="1440" y2="320" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-stretch gap-10 md:gap-16 bg-transparent">
          {/* Left: Headline, subtext, contact details, social icons */}
          <div className="flex-1 flex flex-col justify-center items-start gap-8 px-4 md:px-0">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 font-sans">Let&#39;s work together!</h2>
              <p className="text-lg text-gray-600 mb-6">We&#39;re excited to collaborate. Reach out for demos, support, or partnerships.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700"><span className="font-semibold">Email:</span> <a href="mailto:info@blinkcard.com" className="text-blue-600 hover:underline">info@blinkcard.com</a></div>
              <div className="flex items-center gap-3 text-gray-700"><span className="font-semibold">Phone:</span> <a href="tel:+251988410000" className="text-blue-600 hover:underline">+251 988 410000</a></div>
              <div className="flex items-center gap-3 text-gray-700"><span className="font-semibold">Address:</span> <span>4 kilo, Addis Ababa, Ethiopia</span></div>
            </div>
            {/* Social icons */}
            <div className="flex gap-4 mt-4">
              <a href="#" title="Facebook" className="bg-white/70 backdrop-blur rounded-full p-3 shadow hover:shadow-blue-300 transition duration-200"><svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0z" /></svg></a>
              <a href="#" title="Instagram" className="bg-white/70 backdrop-blur rounded-full p-3 shadow hover:shadow-pink-300 transition duration-200"><svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 5.837 2.633 5.837 5.837 0 4.418-4.418 8-8 8-3.204 0-5.837-2.633-5.837-5.837C2.163 4.796 5.796 2.163 9.204 2.163zM12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12z" /></svg></a>
              <a href="#" title="Twitter" className="bg-white/70 backdrop-blur rounded-full p-3 shadow hover:shadow-cyan-300 transition duration-200"><svg className="w-6 h-6 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.205-7.719-2.165-10.148-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.247-2.228-.616v.062c0 2.385 1.697 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.928-.086.627 1.956 2.444 3.377 4.6 3.417-1.68 1.318-3.809 2.105-6.102 2.105-.396 0-.787-.023-1.175-.069 2.179 1.397 4.768 2.213 7.557 2.213 9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.016-.634.962-.695 1.797-1.562 2.457-2.549z" /></svg></a>
            </div>
          </div>
          {/* Right: Stylish contact form */}
          <div className="flex-1 flex items-center justify-center px-4 md:px-0">
            <form className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/40 flex flex-col gap-6">
              <div className="relative">
                <input type="text" id="name" name="name" required className="peer w-full px-4 pt-6 pb-2 bg-transparent border-b-2 border-gray-300 rounded-t-xl focus:outline-none focus:border-blue-400 transition" placeholder=" " />
                <label htmlFor="name" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">Name</label>
              </div>
              <div className="relative">
                <input type="email" id="email" name="email" required className="peer w-full px-4 pt-6 pb-2 bg-transparent border-b-2 border-gray-300 rounded-t-xl focus:outline-none focus:border-blue-400 transition" placeholder=" " />
                <label htmlFor="email" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">Email</label>
              </div>
              <div className="relative">
                <textarea id="message" name="message" required rows={4} className="peer w-full px-4 pt-6 pb-2 bg-transparent border-b-2 border-gray-300 rounded-t-xl focus:outline-none focus:border-blue-400 transition resize-none" placeholder=" "></textarea>
                <label htmlFor="message" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">Message</label>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center group">
                <span className="group-hover:hidden">Send Message</span>
                <span className="hidden group-hover:inline-flex items-center gap-2 animate-bounce">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Sent!
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer ref={footerRef} className="bg-black pt-10 pb-4 mt-0 text-white transition-all duration-700 opacity-0 translate-y-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-left">
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">Getting Started</div>
            <a href="#how-it-works" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">How it works?</a>
            <a href="#features" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Features</a>
            <a href="#pricing" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Pricing</a>
          </div>
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">My Account</div>
            <a href="/auth/login" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Login</a>
            <a href="/auth/register" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Register</a>
          </div>
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">Helpful Links</div>
            <a href="/refund" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Refund Policy</a>
            <a href="mailto:info@viavel.et" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Support</a>
            <a href="/privacy-policy" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Privacy Policy</a>
            <a href="/terms" className="my-2 block hover:text-gray-300 text-base font-medium transition-colors duration-200">Terms and Conditions</a>
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
            <div className="mt-2">{new Date().getFullYear()} blinkcard. All rights reserved.</div>
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
