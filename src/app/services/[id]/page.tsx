'use client';
import dynamic from "next/dynamic";
const BusinessCardBottomNavBar = dynamic(() => import("@/app/components/BusinessCardBottomNavBar"), { ssr: false });
import React, { useEffect, useState } from "react";
import ServiceCard from "../../customer/components/ServiceCard";
import { Briefcase } from "lucide-react";
import ViewServiceModal from "../../customer/components/ViewServiceModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCustomerDetail } from '@/features/customer/fetchCustomerSlice';
import { getCustomerServices, ServiceModel } from "@/features/service/serviceSlice";
import { bumpPageView } from "@/features/analytics/firestoreAnalytics";
import AboutTab from "@/app/customer/components/AboutTab";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";


export default function ServiceProviderPage() {
    const params = useParams();
    const customerId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';


    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.provider.profile);
    const userLoading = useAppSelector((state) => state.auth.loading);
    const services = useAppSelector((state) => state.service.services);
    const loadingUser = useAppSelector((state) => state.provider.loading === true);
    const loadingServices = useAppSelector((state) => state.service.loading);

    const [viewModal, setViewModal] = useState<{ open: boolean; service: ServiceModel | null }>({ open: false, service: null });

    // Gallery lightbox state
    const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
    const [lightboxImg, setLightboxImg] = useState<string | null>(null);
    const openLightbox = (img: string) => {
        setLightboxImg(img);
        setLightboxOpen(true);
    };
    const closeLightbox = () => {
        setLightboxOpen(false);
        setLightboxImg(null);
    };


    const pageSize = 9;
    const filtered = services;

    useEffect(() => {
        if (!customerId) return;
        dispatch(getCustomerDetail(customerId));
        dispatch(getCustomerServices(customerId));
        bumpPageView(customerId).catch(() => { });
    }, [dispatch, customerId]);

    return (
        <div className="min-h-screen bg-gray-50 ">
            <section className="relative w-full bg-blue-50">
                {!user || userLoading ? (
                    <div className="h-40 sm:h-56 lg:h-64 w-full animate-pulse" />
                ) : user?.banner ? (
                    <div className="relative w-full overflow-hidden max-h-64 sm:max-h-72 lg:max-h-96">
                        <Image
                            src={user.banner}
                            alt="Cover banner"
                            width={1200}
                            height={320}
                            className="w-full h-auto object-contain lg:object-cover object-top block"
                            priority
                            draggable={false}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/img/banner.png";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-200/30 to-transparent" />
                    </div>
                ) : (
                    <div className="relative h-40 sm:h-56 lg:h-64 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300">
                        {/* Decorative pattern overlay */}
                        <div className="absolute inset-0 bg-[url('/img/pattern.svg')] opacity-10 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-black/20" />

                        <span className="relative text-2xl sm:text-3xl lg:text-5xl font-bold tracking-wide text-white drop-shadow-lg">
                            {user?.company_name || `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()}
                        </span>
                    </div>
                )}
            </section>

            <div className="bg-white border-b">
                <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-center">
                    <div className="relative flex flex-col items-center justify-center">
                        <div className="absolute left-1/2 -translate-x-1/2 -top-10 sm:-top-12 h-20 w-20 sm:h-24 sm:w-24 rounded-md overflow-hidden border-4 border-white shadow">
                            {loadingUser || !user ? (
                                <div className="h-full w-full bg-gray-200 animate-pulse" />
                            ) : (
                                <Image
                                    src={user.profile_image || "/img/logoicon.png"}
                                    alt={user.company_name || user.first_name || "Provider"}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover aspect-square"
                                    priority
                                    draggable={false}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/img/logoicon.png";
                                    }}
                                />
                            )}
                        </div>

                    </div>
                </div>
                {user && (

                    <AboutTab user={user} />
                )}
                <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 xl:px-12 py-2 lg:py-4">
                    {/* Services Header */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-8 flex items-center justify-start gap-2">
                        <Briefcase className="inline-block text-blue-500 mb-1" size={28} />
                        Services
                    </h2>
                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {loadingServices ? (
                            Array.from({ length: pageSize }).map((_, i) => (
                                <div key={i} className="rounded-lg border border-blue-100 bg-blue-50 p-4 animate-pulse h-full">
                                    <div className="aspect-square rounded-md bg-blue-100 mb-3" />
                                    <div className="h-4 w-2/3 bg-blue-100 rounded mb-2" />
                                    <div className="h-3 w-1/2 bg-blue-50 rounded" />
                                </div>
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-blue-500">No services match your filters.</p>
                            </div>
                        ) : (
                            filtered.map((service: ServiceModel) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    onView={(s) => setViewModal({ open: true, service: s })}

                                />
                            ))
                        )}
                    </div>

                    {/* Modern Gallery Section */}
                    {user?.gallery && user.gallery.length > 0 && (
                        <section className="bg-gradient-to-br from-blue-50 to-white py-12 rounded-3xl mt-16">
                            <div className="max-w-7xl mx-auto px-6">
                                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Our Gallery</h2>
                                <div className="columns-1 xs:columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-5">
                                    {user.gallery.map((img, i) => (
                                        <div
                                            key={i}
                                            className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group w-full h-48 sm:h-44 md:h-48 lg:h-52 xl:h-56 cursor-pointer"
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
                                                className="relative mx-4 sm:mx-8 flex flex-col items-center"
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
                                                                width={0}
                                                                height={0}
                                                                sizes="100vw"
                                                                className="w-full h-auto object-contain rounded-2xl bg-white"
                                                                style={{ maxHeight: '80vh', maxWidth: '100%' }}
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

            {/* About content always visible below profile image */}
            <footer className="w-full max-w-4xl mx-auto mt-16 pb-6">
                <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-8 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-white text-2xl font-bold mb-2 drop-shadow">Want a digital business card like this for your business?</h3>
                        <p className="text-blue-100 text-base mb-4 md:mb-0 max-w-md">
                            We create modern digital business cards with QR codes, NFC chips (just tap no QR needed), and smart business cards. Let your customers access your menu instantly by scanning or touching, and upgrade your brand with the latest technology.
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

            {/* Modals */}
            {
                viewModal.open && viewModal.service && (
                    <ViewServiceModal
                        open
                        service={viewModal.service}
                        onClose={() => setViewModal({ open: false, service: null })}

                    />
                )
            }

            {/* Bottom nav for small devices */}
            <BusinessCardBottomNavBar
                user={user}
            />
        </div >
    );
}
