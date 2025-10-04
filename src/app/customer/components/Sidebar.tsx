"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from "next/image";

const COPYRIGHT_TEXT = "© 2025 Viavela. All Rights Reserved.";
const MADE_BY_TEXT = "Crafted with ❤️ by";
const MADE_BY_COMPANY = " ZuluTech";
const MADE_BY_URL = "https://www.zulu-tech.com";


export type NavSubItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    inactiveIcon?: React.ReactNode;
};

export type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    subItems?: NavSubItem[];
};

export const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/customer/dashboard',
        icon: "/img/dashboard.svg",
    },

    {
        label: 'BC Services',
        href: '/customer/dashboard/services',
        icon: "/img/services.svg",
    },

    {
        label: 'Menu',
        href: '/customer/dashboard/menu',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu h-5 w-5"><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
        ),
    },
    {
        label: 'Subscription',
        href: '/customer/dashboard/subscription',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card h-5 w-5"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
        ),
    },


    {
        label: 'Settings',
        href: '/customer/dashboard/settings',
        icon: "/img/settings.svg",
        subItems: [
            {
                label: 'General',
                href: '/customer/dashboard/settings/general',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings h-4 w-4"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ),
            },
            {
                label: 'Business',
                href: '/customer/dashboard/settings/business',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building h-4 w-4"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M6 7V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" /><path d="M9 17v2" /><path d="M15 17v2" /></svg>
                ),
            },
            // {
            //     label: 'Payments',
            //     href: '/customer/dashboard/settings/payments',
            //     icon: (
            //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card h-4 w-4"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
            //     ),
            // },
            {
                label: 'Social Links',
                href: '/customer/dashboard/settings/social-links',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link2 h-4 w-4"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
                ),
            },
            {
                label: 'Availability',
                href: '/customer/dashboard/settings/availability',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-4 w-4"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>),
            },
            {
                label: 'QR Code',
                href: '/customer/dashboard/settings/qrcode',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-no-axes-column-increasing h-4 w-4"><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>
                ),
            },
        ],
    },
];

export function Sidebar() {

    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({
        'Service Requests': false,
        'Services': false,
        'Settings': false,
    });

    const getDropdownOpen = (item: NavItem): boolean => {
        if (!item.subItems) return false;
        const userToggled = openDropdown[item.label];
        return userToggled ?? (
            (pathname && pathname.startsWith(item.href)) || (item.subItems.some(s => pathname && pathname.startsWith(s.href)))
        );
    };

    useEffect(() => {
        setOpenDropdown(prev => {
            const next = { ...prev };
            navItems.forEach(item => {
                if (item.subItems && typeof prev[item.label] === 'undefined') {
                    next[item.label] = (pathname && pathname.startsWith(item.href)) || (item.subItems.some(s => pathname && pathname.startsWith(s.href)));
                }
            });
            return next;
        });
    }, [pathname]);

    return (
        <div className='hidden md:block'>
            <div
                data-sidebar="group"
                className="hidden md:flex flex-col w-64 bg-white border-r border-r-blue-500 fixed left-0 z-30 h-screen py-2.5 top-0 overflow-y-auto shadow-xl"
            >
                <div className="flex items-center justify-between pt-4 pb-2 border-b border-blue-500 sticky top-0 bg-white z-20">
                    <div className="flex items-center gap-2 px-4 ">
                        <Image src="/img/logo.png" height={60} width={60} className=" w-36" alt="lolelink logo" />
                    </div>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto px-4 pt-8">
                    <nav className="flex-1 w-full text-sm">
                        <ul className="flex w-full min-w-0 flex-col gap-5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                if (item.subItems) {
                                    const dropdownOpen = getDropdownOpen(item);
                                    return (
                                        <li data-sidebar="menu-item" className="group/menu-item relative" key={item.href}>
                                            <button
                                                type="button"
                                                className={`peer/menu-button flex w-full text-sm font-normal font-['Segoe_UI'] leading-tight items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-blue-900 active:text-blue-400 disabled:pointer-events-none disabled:opacity-50 h-8 ${isActive || dropdownOpen
                                                    ? 'text-blue-400'
                                                    : 'text-gray-900 hover:bg-gray-100 hover:text-blue-400'
                                                    }`}
                                                onClick={() => setOpenDropdown((prev) => ({ ...prev, [item.label]: prev[item.label] ? false : true }))}
                                            >
                                                <span className={isActive || dropdownOpen ? 'text-blue-400' : 'text-blue-500'}>
                                                    {typeof item.icon === 'string' ? (
                                                        <Image src={item.icon as string} alt={`${item.label} icon`} width={20} height={20} className="h-5 w-5" />
                                                    ) : (
                                                        item.icon
                                                    )}
                                                </span>
                                                <span className="flex-1 truncate font-medium transition-all duration-500 ease-out">{item.label}</span>
                                                {/* Dropdown icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down h-4 w-4 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''} ${isActive || dropdownOpen ? 'text-blue-400' : 'text-blue-300'}`}> <path d="m6 9 6 6 6-6"></path></svg>
                                            </button>
                                            {/* Render subitems if open */}
                                            {dropdownOpen && (
                                                <div className="ml-8 mt-1 space-y-0.5 pl-2 border-l-2 border-blue-900 bg-white">
                                                    {item.subItems.map((sub) => {
                                                        const isSubActive = pathname === sub.href;
                                                        return (
                                                            <Link
                                                                key={sub.href}
                                                                href={sub.href}
                                                                className={`w-full flex items-center justify-between p-2 text-sm rounded-md transition-all duration-200 ${isSubActive
                                                                    ? 'text-blue-400'
                                                                    : 'text-gray-800 hover:bg-gray-100 hover:text-blue-400'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className={isSubActive ? 'text-blue-400' : 'text-blue-500'}>
                                                                        {!isSubActive && sub.inactiveIcon != null ? sub.inactiveIcon : sub.icon}
                                                                    </span>
                                                                    <span className={`${isSubActive ? 'text-blue-400' : 'text-gray-900'} font-medium transition-all duration-500 ease-out`}>{sub.label}</span>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </li>
                                    );
                                }
                                // Normal nav item
                                return (
                                    <li data-sidebar="menu-item" className="group/menu-item relative" key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`peer/menu-button flex text-sm font-normal font-['Segoe_UI'] leading-tight w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] transition-all duration-500 ease-out focus-visible:ring-2 active:bg-blue-900 active:text-blue-400 disabled:pointer-events-none disabled:opacity-50 h-8 ${isActive ? 'text-blue-400' : 'text-gray-900 hover:bg-gray-100 hover:text-blue-400'}`}
                                        >
                                            <span className={isActive ? 'text-blue-400' : 'text-blue-500'}>
                                                {typeof item.icon === 'string' ? (
                                                    <Image src={item.icon} alt={`${item.label} icon`} width={20} height={20} className="h-5 w-5" />
                                                ) : (
                                                    item.icon
                                                )}
                                            </span>
                                            <span className="flex-1 truncate font-medium transition-all duration-500 ease-out">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    <div className="mt-auto flex flex-col items-center text-xs text-blue-200 py-4">
                        <div className="mb-1">
                            {COPYRIGHT_TEXT}
                        </div>
                        <div>
                            {MADE_BY_TEXT}
                            <span className="text-blue-400 font-semibold">
                                <Link href={MADE_BY_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {MADE_BY_COMPANY}
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


