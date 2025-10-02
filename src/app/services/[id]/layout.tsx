import type { Metadata } from "next";
import { supabase } from "@/supabaseClient";

// Generate dynamic OG/Twitter metadata for a provider's services page when shared
// Use a generic props type to avoid Next.js build type errors
// In Next 14+, dynamic route params can be a Promise. Await it before use.
export async function generateMetadata(props: any): Promise<Metadata> {
    const { id } = await props.params;
    if (!id) return {};

    // Fetch provider details and one featured service image for preview
    // Be robust whether the route param is provider.user_id or provider.id
    const providerByUserId = await supabase
        .from("provider")
        .select("companyName, firstName, lastName, profileImage, banner, profileBio, industry")
        .eq("user_id", id)
        .single();
    const provider = providerByUserId.data ?? (
        await supabase
            .from("provider")
            .select("companyName, firstName, lastName, profileImage, banner, profileBio, industry")
            .eq("id", id)
            .single()
    ).data;

    const { data: services } = await supabase
        .from("service")
        .select("serviceName, description, serviceImage, status")
        .eq("provider_id", id)
        .eq("status", true)
        .limit(1);

    const titleBase = provider?.companyName || [provider?.firstName, provider?.lastName].filter(Boolean).join(" ") || "Provider";
    const title = `${titleBase} • Services`;
    const description = provider?.profileBio || provider?.industry || "Explore services, pricing, and availability.";

    // Pick a preview image: first active service image, else banner, else profile
    const siteUrl = process.env.SITE_URL || "www.lolelink.com";
    const makeAbsolute = (img: string) => {
        if (!img) return `${siteUrl}/img/banner.png`;
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        if (img.startsWith("/")) return `${siteUrl}${img}`;
        // Supabase public bucket: ensure full URL
        if (img.includes("supabase.co")) return img;
        return `${siteUrl}/img/banner.png`;
    };

    const imgCandidate = Array.isArray(services) && services[0]?.serviceImage?.[0]
        ? services[0].serviceImage[0]
        : provider?.banner || provider?.profileImage || "/img/banner.png";
    const ogImage = makeAbsolute(imgCandidate);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "profile",
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    // SEO: inject JSON-LD for the first service and provider
    // This assumes you have access to the same data as in generateMetadata
    // If not, you may need to fetch it here or pass as props
    // For now, use window.__NEXT_DATA__ as a fallback for client-side hydration
    // You can refactor to use props if you want SSR/SSG
    // Example below uses dummy values for illustration

    // You may want to move this logic to a server component for true SSR
    // For now, this will work for most Next.js setups
    const serviceJsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.serviceName || "Service",
        "description": typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.serviceDescription || "Service description",
        "provider": {
            "@type": "Organization",
            "name": typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.providerName || "Provider"
        },
        "image": typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.ogImage || ""
    };

    return <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        {children}
    </>;
}
