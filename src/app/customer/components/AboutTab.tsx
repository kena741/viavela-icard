import { UserModel } from "@/features/auth/loginSlice";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Globe, Phone, Mail, MapPin, Users, Calendar } from "lucide-react";
import { JSX } from "react";

type SocialLinkType = "website" | "linkedin" | "twitter" | "x" | "instagram" | "facebook" | "youtube";
interface SocialLink {
    type: SocialLinkType;
    url: string;
    label?: string;
}

interface AboutTabProps {
    user: UserModel;
}

const AboutTab: React.FC<AboutTabProps> = ({ user }) => {
    // Dummy fallback data (Lolelink version) used when fields are missing
    const company = user.company_name || "Lolelink";
    const bio = user.profile_bio || `${company} is a modern services platform helping businesses deliver delightful customer experiences through technology, design, and automation.`;
    const industry = user.industry || "-";
    const size = user.company_size || "-";
    const hq = user.headquarters || "-";
    const founded = user.founded || "-";
    const phone = user.phone_number || "-";
    const email = user.email || "-";

    const links: SocialLink[] = (Array.isArray(user.social_links) && user.social_links.length > 0)
        ? (user.social_links as SocialLink[])
        : [
            { type: "website", url: "https://lolelink.com" },
            { type: "linkedin", url: "https://linkedin.com/company/lolelink" },
            { type: "twitter", url: "https://x.com/lolelink" },
            { type: "instagram", url: "https://instagram.com/lolelink" },
        ];

    const iconFor = (type: SocialLinkType): JSX.Element | null => {
        switch (type) {
            case "facebook": return <Facebook size={16} className="text-[#1877F2]" />;
            case "twitter":
            case "x": return <Twitter size={16} className="text-[#1DA1F2]" />;
            case "instagram": return <Instagram size={16} className="text-[#E4405F]" />;
            case "linkedin": return <Linkedin size={16} className="text-[#0A66C2]" />;
            case "youtube": return <Youtube size={16} className="text-[#FF0000]" />;
            case "website": return <Globe size={16} className="text-black" />;
            default: return null;
        }
    };

    return (
        <section className="flex justify-center py-6 sm:py-8 px-2">
            <div className="w-full max-w-4xl p-6 sm:p-8">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">About {company}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-black"><Users size={14} /> {size} employees</span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-black"><MapPin size={14} /> {hq}</span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-black"><Calendar size={14} /> Founded {founded}</span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-black"><Globe size={14} /> Industry {industry}</span>
                    </div>
                </div>

                {/* Overview */}
                <div className="mb-6">
                    <p className="text-black whitespace-pre-line leading-relaxed text-base sm:text-lg">{bio}</p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="rounded-lg border bg-gray-50 p-4">
                        <a
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="text-blue-600 hover:underline inline-flex items-center gap-2"
                        >
                            <Phone size={16} /> {phone}
                        </a>
                    </div>
                    <div className="rounded-lg border bg-gray-50 p-4">
                        <a
                            href={`mailto:${email}`}
                            className="text-blue-600 hover:underline inline-flex items-center gap-2"
                        >
                            <Mail size={16} /> {email}
                        </a>
                    </div>
                </div>

                {/* Social links */}
                <div className="mt-6">
                    <div className="text-sm font-medium text-gray-700 mb-2">Connect</div>
                    <div className="flex flex-wrap gap-2">
                        {links.map((link: SocialLink, idx: number) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-black px-3 py-1.5 text-sm"
                            >
                                {iconFor(link.type) || null}
                                <span className="capitalize">{link.label || link.type}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutTab;
