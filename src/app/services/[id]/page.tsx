'use client';
import React, { useEffect, useState } from "react";
import ServiceCard from "../../customer/components/ServiceCard";
import ViewServiceModal from "../../customer/components/ViewServiceModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getProviderDetail } from '@/features/provider/providerSlice';
import { getCustomerServices, ServiceModel } from "@/features/service/serviceSlice";
import { bumpPageView } from "@/features/analytics/firestoreAnalytics";
import AboutTab from "@/app/customer/components/AboutTab";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Params = Promise<{ id: string }>;

export default function ServiceProviderPage(props: { params: Params }) {
    const [providerId, setProviderId] = useState<string | null>(null);
    useEffect(() => {
        (async () => {
            const { id } = await props.params;
            setProviderId(id);
        })();
    }, [props.params]);
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.provider.profile);
    const userLoading = useAppSelector((state) => state.auth.loading);
    const services = useAppSelector((state) => state.service.services);
    const loadingUser = useAppSelector((state) => state.provider.loading === true);
    const loadingServices = useAppSelector((state) => state.service.loading);

    const [viewModal, setViewModal] = useState<{ open: boolean; service: ServiceModel | null }>({ open: false, service: null });

    const [activeTab, setActiveTab] = useState<"home" | "about">("home");
    const pageSize = 9;
    const router = useRouter();
    const filtered = services;



    useEffect(() => {
        if (!providerId) return;
        dispatch(getProviderDetail(providerId));
        dispatch(getCustomerServices(providerId));
        bumpPageView(providerId).catch(() => { });
    }, [dispatch, providerId]);

    return (
        <div className="min-h-screen bg-gray-50">
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
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
                    <div className="relative">
                        <div className="absolute -top-10 sm:-top-12 h-20 w-20 sm:h-24 sm:w-24 rounded-md overflow-hidden border-4 border-white shadow">
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
                        <div className="pt-12 sm:pt-14 pb-4">
                            {loadingUser || userLoading || !user ? (
                                <>
                                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                                    <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                                </>
                            ) : (
                                <>
                                    <h1 className="text-xl sm:text-2xl font-semibold truncate text-gray-900">
                                        {user.company_name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
                                    </h1>
                                    <p className="text-xs text-gray-600 truncate">
                                        {user.industry || 'Provider'} • {services?.length ?? 0} services
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
                    <div className="flex flex-col gap-3">
                        {/* Sticky nav: tabs + search */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
                            <nav className="flex items-center gap-1">
                                <button
                                    className={`px-3 py-2 text-sm font-medium rounded-md border ${activeTab === 'home' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
                                    onClick={() => setActiveTab('home')}
                                    aria-current={activeTab === 'home' ? 'page' : undefined}
                                >
                                    Home
                                </button>
                                <button
                                    className={`px-3 py-2 text-sm font-medium rounded-md border ${activeTab === 'about' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
                                    onClick={() => setActiveTab('about')}
                                    aria-current={activeTab === 'about' ? 'page' : undefined}
                                >
                                    About
                                </button>
                            </nav>

                        </div>

                    </div>
                </div>
            </div>

            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-10">
                {activeTab === 'about' && user ? (
                    <div className="bg-white rounded-lg border border-blue-100 p-4 sm:p-6 lg:p-8 mb-6">
                        <AboutTab user={user} />
                    </div>
                ) : null}
                {/* Grid */}
                {activeTab === 'home' && (
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
                )}

            </main>

            {/* Final CTA Section */}
            <div className="px-4 md:px-12 lg:px-40">
                <section className="mt-16 py-16 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to grow?</h2>
                            <p className="text-xl opacity-90 mb-10">Join thousands of providers and customers on our platform.</p>
                            <button
                                className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 bg-white text-blue-500 hover:bg-blue-100"
                                onClick={() => router.push("/auth/login?tab=signup")}
                            >
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </section>
            </div>

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

        </div >
    );
}
