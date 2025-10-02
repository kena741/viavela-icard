'use client';
import React, { useEffect, useMemo, useState } from "react";
import ServiceCard from "../../customer/components/ServiceCard";
import ViewServiceModal from "../../customer/components/ViewServiceModal";
import RequestServiceModal from "../../components/RequestServiceModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getProviderDetail } from '@/features/provider/providerSlice';
import { getCustomerServices, ServiceModel } from "@/features/service/serviceSlice";
import { Search } from "lucide-react";
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
    const [requesting, setRequesting] = useState(false);
    const [requestedService, setRequestedService] = useState<ServiceModel | null>(null);

    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "newest">("relevance");
    const [activeTab, setActiveTab] = useState<"home" | "about">("home");
    const pageSize = 9;
    const router = useRouter();

    const coercePrice = (p?: string) => {
        if (!p) return Number.NaN;
        const n = parseFloat((p || '').toString().replace(/[^0-9.]/g, ''));
        return Number.isFinite(n) ? n : Number.NaN;
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = services.filter((service: ServiceModel) => {
            if (!service.status) return false;
            const inQuery = !q ||
                service.service_name?.toLowerCase().includes(q) ||
                service.description?.toLowerCase().includes(q);
            return inQuery;
        });
        switch (sortBy) {
            case "price-asc":
                return list.slice().sort((a, b) => (coercePrice(a.price) || Infinity) - (coercePrice(b.price) || Infinity));
            case "price-desc":
                return list.slice().sort((a, b) => (coercePrice(b.price) || -Infinity) - (coercePrice(a.price) || -Infinity));
            case "newest":
                return list.slice().sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
            default:
                return list;
        }
    }, [services, query, sortBy]);

    useEffect(() => {
        if (!providerId) return;
        dispatch(getProviderDetail(providerId));
        dispatch(getCustomerServices(providerId));
        bumpPageView(providerId).catch(() => { });
    }, [dispatch, providerId]);

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="relative w-full bg-orange-50">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-200/30 to-transparent" />
                    </div>
                ) : (
                    <div className="relative h-40 sm:h-56 lg:h-64 w-full flex items-center justify-center bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300">
                        {/* Decorative pattern overlay */}
                        <div className="absolute inset-0 bg-[url('/img/pattern.svg')] opacity-10 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-black/20" />

                        <span className="relative text-2xl sm:text-3xl lg:text-5xl font-bold tracking-wide text-white drop-shadow-lg">
                            {user?.companyName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
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
                                    src={user.profileImage || "/img/logoicon.png"}
                                    alt={user.companyName || user.firstName || "Provider"}
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
                                        {user.companyName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}
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
                                    className={`px-3 py-2 text-sm font-medium rounded-md border ${activeTab === 'home' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}
                                    onClick={() => setActiveTab('home')}
                                    aria-current={activeTab === 'home' ? 'page' : undefined}
                                >
                                    Home
                                </button>
                                <button
                                    className={`px-3 py-2 text-sm font-medium rounded-md border ${activeTab === 'about' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}
                                    onClick={() => setActiveTab('about')}
                                    aria-current={activeTab === 'about' ? 'page' : undefined}
                                >
                                    About
                                </button>
                            </nav>
                            <div className="flex items-center gap-2 md:min-w-[420px]">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search services..."
                                        className="w-full h-10 pl-9 pr-3 rounded-md border border-orange-200 bg-orange-50 text-sm text-gray-900 placeholder-gray-500 caret-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        aria-label="Search services"
                                    />
                                </div>
                                <select
                                    aria-label="Sort services"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "relevance" | "price-asc" | "price-desc" | "newest")}
                                    className="h-10 rounded-md border border-orange-200 bg-orange-50 text-sm text-gray-900 px-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    <option value="relevance">Sort: Relevance</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Category chips removed */}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-10">
                {activeTab === 'about' && user ? (
                    <div className="bg-white rounded-lg border border-orange-100 p-4 sm:p-6 lg:p-8 mb-6">
                        <AboutTab user={user} />
                    </div>
                ) : null}
                {/* Grid */}
                {activeTab === 'home' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {loadingServices ? (
                            Array.from({ length: pageSize }).map((_, i) => (
                                <div key={i} className="rounded-lg border border-orange-100 bg-orange-50 p-4 animate-pulse h-full">
                                    <div className="aspect-square rounded-md bg-orange-100 mb-3" />
                                    <div className="h-4 w-2/3 bg-orange-100 rounded mb-2" />
                                    <div className="h-3 w-1/2 bg-orange-50 rounded" />
                                </div>
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-orange-500">No services match your filters.</p>
                            </div>
                        ) : (
                            filtered.map((service: ServiceModel) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    onView={(s) => setViewModal({ open: true, service: s })}
                                    onRequest={(s) => {
                                        setRequestedService(s);
                                        setRequesting(true);
                                    }}
                                />
                            ))
                        )}
                    </div>
                )}

            </main>

            {/* Final CTA Section */}
            <div className="px-4 md:px-12 lg:px-40">
                <section className="mt-16 py-16 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to grow?</h2>
                            <p className="text-xl opacity-90 mb-10">Join thousands of providers and customers on our platform.</p>
                            <button
                                className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 bg-white text-orange-500 hover:bg-orange-100"
                                onClick={() => router.push("/auth?tab=signup")}
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
                        onRequest={() => {
                            setRequesting(true);
                            setRequestedService(viewModal.service!);
                        }}
                    />
                )
            }
            {
                requesting && requestedService && !viewModal.open && (
                    <RequestServiceModal
                        open
                        onClose={() => {
                            setRequesting(false);
                            setRequestedService(null);
                        }}
                        provider_id={providerId ?? ""}
                        serviceDetails={requestedService}
                    />
                )
            }
        </div >
    );
}
