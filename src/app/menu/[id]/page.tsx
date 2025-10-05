"use client";
import React, { useState, useEffect, useCallback } from "react";

import { useParams } from "next/navigation";
import { fetchCategories } from '@/features/category/categorySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMenuItems } from '@/features/menu/fetchmenuItemsSlice';
import { getCustomerDetail } from '@/features/customer/fetchCustomerSlice';
import Image from "next/image";
import { motion } from "framer-motion";
import MenuItemCard from "@/app/components/MenuItemCard";



export default function DigitalMenu() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const customerId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categoryState = useAppSelector((state) => state.category);
  const { items: categories, loading: catLoading, error: catError } = categoryState;
  const provider = useAppSelector((state) => state.provider);
  const user = provider.profile;
  const authLoading = provider.loading;
  const menuItemsState = useAppSelector((state) => state.menuItems);
  const { items: menuItems, loading: menuLoading, error: menuError } = menuItemsState;
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Close on Esc
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen]);

  // Open lightbox
  const openLightbox = useCallback((img: string) => {
    setLightboxImg(img);
    setLightboxOpen(true);
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxImg(null), 200); // allow animation
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch customer detail for the customerId from params
  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerDetail(customerId));
    }
  }, [customerId, dispatch]);

  // Fetch menu items for current customerId from params
  useEffect(() => {
    if (customerId) {
      dispatch(fetchMenuItems(customerId));
    }
  }, [customerId, dispatch]);

  // Group menu items by category
  const groupedMenuItems = categories.map((cat) => ({
    category: cat.en.name,
    icon: cat.en.image || '/img/placeholder.jpg',
    items: menuItems.filter((item) => item.category === cat.en.name),
  }));

  const allCategories = [
    { name: 'All', icon: '/img/analytics.png' },
    ...groupedMenuItems.map((section) => ({ name: section.category, icon: section.icon })),
  ];

  // Filtering logic
  let filteredItems: typeof menuItems = [];
  if (selectedCategory === 'All') {
    filteredItems = menuItems;
  } else {
    filteredItems = menuItems.filter((item) => item.category === selectedCategory);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-2 md:px-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8 md:p-14 flex flex-col gap-14">
        {/* Company Banner */}
        <section className="relative flex flex-col items-center justify-center mb-10 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-blue-100 to-blue-300 min-h-[180px]">
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${user?.banner ? user.banner : '/img/hero-background.png'})` }}
          />
          <div className="relative z-10 flex flex-col items-center py-10 px-4">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-md mb-5 transition-transform duration-300 hover:scale-105 mx-auto">
              <Image
                src={user?.profile_image || "/img/logo.png"}
                alt="Company Logo"
                width={64}
                height={64}
                className="object-contain mx-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-2 tracking-tight">
              {authLoading ? 'Loading…' : user?.company_name || 'Company Name'}
            </h1>
            <p className="text-blue-500 text-lg md:text-xl font-medium">Modern Digital Menu</p>
          </div>
        </section>

        {/* Horizontal Category Cards */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {catLoading ? (
            <div className="text-blue-500 text-lg">Loading categories…</div>
          ) : catError ? (
            <div className="text-red-500 text-lg">{catError}</div>
          ) : menuError ? (
            <div className="text-red-500 text-lg">{menuError}</div>
          ) : (
            allCategories.map((cat) => (
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
            ))
          )}
        </div>

        {/* Filtered Menu List */}
        <main>
          {filteredItems.length === 0 && !catLoading && !menuLoading && (
            <div className="text-center text-blue-400">No items found.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id || item.name}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image_url={item.image_url}
              />
            ))}
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
          {user?.gallery && user.gallery.length > 0 && (
            <section className="bg-gradient-to-br from-blue-50 to-white py-12 rounded-3xl mt-16">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Our Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {user.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group w-full h-full min-h-[180px] min-w-[180px] cursor-pointer"
                      style={{ aspectRatio: '4/3' }}
                      onClick={() => openLightbox(img)}
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${i}`}
                        fill
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        priority={i < 6}
                      />
                    </div>
                  ))}
                  {/* Lightbox Popup */}
                  {lightboxOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
                      onClick={closeLightbox}
                    >
                      <div
                        className="relative max-w-3xl w-full mx-4 sm:mx-8 flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg text-2xl font-bold transition-all"
                          onClick={closeLightbox}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ duration: 0.22 }}
                          className="w-full flex items-center justify-center"
                        >
                          {lightboxImg && (
                            <div className="relative w-full h-[60vw] max-h-[80vh] max-w-3xl bg-white rounded-2xl flex items-center justify-center shadow-xl">
                              <Image
                                src={lightboxImg}
                                alt="Gallery Full"
                                fill
                                className="object-contain rounded-2xl bg-white"
                                style={{ maxHeight: '80vh', maxWidth: '100%' }}
                                sizes="100vw"
                                priority
                              />
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
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
