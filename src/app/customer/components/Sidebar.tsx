
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from "next/image";
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { getNavItems } from './navConfig';

const COPYRIGHT_TEXT = "© 2025 blinkcard. All Rights Reserved.";
const MADE_BY_TEXT = "Crafted with ❤️ by";
const MADE_BY_COMPANY = " Zulu Tech";
const MADE_BY_URL = "https://www.zulu-tech.com";

export default function Sidebar() {
    const user = useSelector((state: RootState) => state.auth.user);
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(() => pathname.startsWith('/customer/dashboard/settings'));

    const nav = getNavItems(user);

    return (
        <div className='hidden md:block'>
            <div
                data-sidebar="group"
                className="hidden md:flex flex-col w-64 bg-white border-r border-r-blue-500 fixed left-0 z-30 h-screen py-2.5 top-0 overflow-y-auto shadow-xl"
            >
                <div className="flex items-center justify-between pt-4 pb-2 border-b border-blue-500 sticky top-0 bg-white z-20">
                    <div className="flex items-center gap-2 px-4 ">
                        <Image src="/img/logo.png" height={60} width={60} className=" w-36" alt="blink-card logo" />
                    </div>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto px-4 pt-8">
                    <nav className="flex-1 w-full text-sm">
                        <ul className="flex w-full min-w-0 flex-col gap-5">
                            {nav.map((item) => {
                                const isActive = pathname === item.href;
                                // If item has subItems, render dropdown
                                if (item.subItems) {
                                    return (
                                        <li data-sidebar="menu-item" className="group/menu-item relative" key={item.href}>
                                            <button
                                                type="button"
                                                className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm font-normal font-['Segoe_UI'] leading-tight outline-none ring-sidebar-ring transition-all duration-500 ease-out focus-visible:ring-2 active:bg-blue-900 active:text-blue-400 disabled:pointer-events-none disabled:opacity-50 h-8 ${isActive || dropdownOpen ? 'text-blue-400' : 'text-gray-900 hover:bg-gray-100 hover:text-blue-400'}`}
                                                onClick={() => setDropdownOpen((open) => !open)}
                                            >
                                                <span className={isActive ? 'text-blue-400' : 'text-blue-500'}>
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
                                            {(dropdownOpen || pathname.startsWith('/customer/dashboard/settings')) && (
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
                                                    <Image src={item.icon as string} alt={`${item.label} icon`} width={20} height={20} className="h-5 w-5" />
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


