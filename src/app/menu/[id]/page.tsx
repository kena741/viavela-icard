"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const menuItems = [
  {
    category: "Starters",
    icon: "/img/chooseus.png",
    items: [
      { name: "Bruschetta", description: "Grilled bread with tomato, basil, and olive oil.", price: "$6", img: "/img/placeholder.jpg" },
      { name: "Caesar Salad", description: "Crisp romaine, parmesan, croutons, creamy dressing.", price: "$8", img: "/img/placeholder.jpg" },
    ],
  },
  {
    category: "Mains",
    icon: "/img/dashboard.png",
    items: [
      { name: "Grilled Salmon", description: "Fresh salmon fillet, lemon butter sauce, seasonal veggies.", price: "$18", img: "/img/placeholder.jpg" },
      { name: "Chicken Alfredo", description: "Pasta, grilled chicken, creamy Alfredo sauce.", price: "$15", img: "/img/placeholder.jpg" },
    ],
  },
  {
    category: "Desserts",
    icon: "/img/girl.png",
    items: [
      { name: "Tiramisu", description: "Classic Italian dessert with coffee and mascarpone.", price: "$7", img: "/img/placeholder.jpg" },
      { name: "Chocolate Lava Cake", description: "Warm chocolate cake with molten center.", price: "$8", img: "/img/placeholder.jpg" },
    ],
  },
  {
    category: "Drinks",
    icon: "/img/handyman.svg",
    items: [
      { name: "Espresso", description: "Rich Italian espresso shot.", price: "$3", img: "/img/placeholder.jpg" },
      { name: "Sparkling Water", description: "Chilled, refreshing.", price: "$2", img: "/img/placeholder.jpg" },
    ],
  },
];

export default function DigitalMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>(menuItems[0].category);


  const categories = [
    { name: "All", icon: "/img/analytics.png" },
    ...menuItems.map((section) => ({ name: section.category, icon: section.icon })),
  ];

  let filteredSections;
  if (selectedCategory === "All") {
    filteredSections = menuItems;
  } else {
    const found = menuItems.find((section) => section.category === selectedCategory);
    filteredSections = found ? [found] : [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-2 md:px-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8 md:p-14 flex flex-col gap-14">
        {/* Company Banner */}
        <section className="relative flex flex-col items-center justify-center mb-10 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-blue-100 to-blue-300 min-h-[180px]">
          <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: 'url(/img/hero-background.png)' }} />
          <div className="relative z-10 flex flex-col items-center py-10 px-4">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-md mb-5 transition-transform duration-300 hover:scale-105">
              <Image src="/img/logo.png" alt="Company Logo" width={64} height={64} className="object-contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-2 tracking-tight">Company Name</h1>
            <p className="text-blue-500 text-lg md:text-xl font-medium">Modern Digital Menu</p>
          </div>
        </section>

        {/* Horizontal Category Cards */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-base transition-all duration-300 whitespace-nowrap focus:outline-none shadow-sm
                ${selectedCategory === cat.name
                  ? 'bg-blue-50 text-blue-700 shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md'}`}
              aria-pressed={selectedCategory === cat.name}
              style={{ minWidth: 130, height: 64 }}
            >
              <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 transition-transform duration-300 group-hover:scale-110">
                <Image src={cat.icon} alt={cat.name} width={40} height={40} style={{ width: 40, height: 40 }} />
              </span>
              <span className="font-medium text-base">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filtered Menu List */}
        <main>
          {filteredSections.length === 0 && (
            <div className="text-center text-blue-400">No items found.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSections.flatMap((section) =>
              section.items.map((item, idx) => (
                <motion.div
                  key={item.name}
                  className="relative rounded-2xl bg-white p-7 flex flex-col gap-2 shadow group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(0, 60, 255, 0.10)" }}
                >
                  <motion.div
                    className="flex justify-center items-center mb-2"
                    whileHover={{ scale: 1.10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image src={item.img} alt={item.name} width={90} height={90} className="rounded-xl object-cover shadow-sm" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center mb-3">
                    <span className="text-blue-600 font-bold text-lg">{item.price}</span>
                  </div>
                  <div>
                    <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm">Order Now</button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Special Foods Glaccy Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-blue-800 mb-7">Special Foods</h2>
            <div className="flex flex-col gap-8">
              {[
                {
                  img: "/img/chooseus.png",
                  title: "Breakfast Specials",
                  desc: "Explore our most loved morning flavors, carefully prepared to energize your day. Fresh, healthy, and delicious.",
                  price: "$9.99",
                  oldPrice: "$12.99",
                },
                {
                  img: "/img/dashboard.png",
                  title: "Pizza Fiesta",
                  desc: "A cheesy, saucy delight with a crispy crust and fresh toppings. Perfect for sharing or solo cravings!",
                  price: "$12.99",
                  oldPrice: "$15.99",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="relative rounded-3xl bg-white/95 shadow-xl p-7 flex flex-col md:flex-row items-center gap-7 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  initial={{ opacity: 0, x: i % 2 === 0 ? 100 : -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, type: "spring", delay: i * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <Image src={item.img} alt={item.title} width={140} height={140} className="rounded-2xl object-cover shadow-sm transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div className="flex-1 flex flex-col items-start">
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{item.desc}</p>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-blue-600 font-bold text-lg">{item.price}</span>
                      <span className="text-xs text-gray-400 line-through">{item.oldPrice}</span>
                    </div>
                    <button className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm">Order Now</button>
                  </div>
                  <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">SPECIAL</span>
                </motion.div>
              ))}
            </div>
          </section>
          {/* Modern Gallery Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-blue-800 mb-7">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {["/img/hero-background.png", "/img/chooseus.png", "/img/dashboard.png", "/img/girl.png", "/img/placeholder.jpg", "/img/handyman.svg"].map((src, i) => (
                <motion.div
                  key={i}
                  className="overflow-hidden rounded-2xl shadow bg-white group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.04 }}
                >
                  <Image src={src} alt={`Gallery ${i + 1}`} width={400} height={300} className="object-cover w-full h-44 group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Modern Footer for similar page requests */}
      <footer className="w-full max-w-5xl mx-auto mt-16 mb-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-8 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white text-2xl font-bold mb-2 drop-shadow">Want a digital menu like this for your business?</h3>
            <p className="text-blue-100 text-base mb-4 md:mb-0 max-w-md">
              We create modern digital menus with QR codes, NFC chips (just tap no QR needed), and smart business cards. Let your customers access your menu instantly by scanning or touching, and upgrade your brand with the latest technology.
            </p>
          </div>
          <a
            href="/contact"
            className="mt-4 md:mt-0 inline-block bg-white text-blue-700 font-semibold px-7 py-3 rounded-xl shadow-lg hover:bg-blue-50 hover:text-blue-900 transition-all text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          >
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
}
