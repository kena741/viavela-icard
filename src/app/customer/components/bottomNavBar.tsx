'use client'
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems as sidebarNavItems } from "./Sidebar";

const BottomNavBar = () => {
  const [openPopupIdx, setOpenPopupIdx] = useState<number | null>(null);
  const pathname = usePathname();

  const handleNav = () => setOpenPopupIdx(null);

  const mobileLabel = (label: string) => {
    if (label === "Dashboard") return "Home";
    if (label === "Service Requests") return "Requests";
    return label;
  };

  const getPopupMarginClass = (idx: number) => {
    const baseMargins = ["-mr-0", "ml-1", "-ml-8", "-ml-12", "-ml-4"];
    return baseMargins[idx] || "max-sm:-ml-16 -ml-10";
  };

  const newLocal = "md:hidden fixed bottom-0 left-0 right-0 bg-white z-50";
  return (
    <div className={newLocal}>
      <div className="h-[2px] w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400orange"></div>
      <div className="flex items-stretch w-full relative">
        {sidebarNavItems.map((item, idx) => {
          const isActiveTop =
            pathname === item.href ||
            (item.subItems?.some((s: { href: string }) => s.href === pathname) ?? false);
          const renderIcon = (icon: React.ReactNode | string) => {
            if (typeof icon === "string") {
              return (
                <Image
                  src={icon}
                  alt={`${item.label} icon`}
                  className="h-5 w-5"
                  width={20}
                  height={20}
                />
              );
            }
            return icon;
          };
          return (
            <div key={item.href} className="relative flex flex-col items-center flex-1">
              {item.subItems ? (
                <>
                  <button
                    className={`flex flex-col items-center justify-center py-3 px-2 w-full transition-all duration-200 ${
                      isActiveTop ? "text-sky-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setOpenPopupIdx(openPopupIdx === idx ? null : idx)}
                    aria-label={item.label}
                  >
                    <span className={isActiveTop ? "text-sky-600" : "text-gray-500"}>
                      {renderIcon(item.icon)}
                    </span>
                    <span className="text-[10px] mt-1 truncate w-full text-center">
                      {mobileLabel(item.label)}
                    </span>
                  </button>
                  {openPopupIdx === idx && (
                    <div className={`absolute bottom-full mb-1 ${getPopupMarginClass(idx)} left-1/2 -translate-x-1/2 w-38 max-w-[calc(100vw-32px)] bg-white rounded-lg shadow-lg border border-gray-200 max-h-[60vh] overflow-y-auto p-2 z-[60] animate-fade-in`}>
                      {item.subItems.map((sub: { href: string; label: string; icon: React.ReactNode | string; inactiveIcon?: React.ReactNode | string }) => {
                        const isSubActive = pathname === sub.href;
                        const subIcon =
                          !isSubActive && sub.inactiveIcon != null ? sub.inactiveIcon : sub.icon;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={handleNav}
                            className={`w-full text-left py-2 px-3 rounded-md flex items-center text-[12px] ${
                              isSubActive ? "bg-gray-100 text-sky-600" : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span className="mr-2">{renderIcon(subIcon)}</span>
                            <span className="truncate">{mobileLabel(sub.label)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  onClick={handleNav}
                  className="flex-1"
                >
                  <button
                    className={`flex flex-col items-center justify-center py-3 px-2 w-full transition-all duration-200 ${
                      isActiveTop ? "text-sky-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className={isActiveTop ? "text-sky-600" : "text-gray-500"}>
                      {renderIcon(item.icon)}
                    </span>
                    <span className="text-[10px] mt-1 truncate w-full text-center">
                      {mobileLabel(item.label)}
                    </span>
                  </button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
      {openPopupIdx !== null && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenPopupIdx(null)}
        />
      )}
    </div>
  );
};

export default BottomNavBar;
