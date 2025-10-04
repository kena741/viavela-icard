import type { ReactNode } from 'react';

export type NavSubItem = {
    label: string;
    href: string;
    icon: ReactNode;
    inactiveIcon?: ReactNode;
};

export type NavItem = {
    label: string;
    href: string;
    icon: ReactNode;
    subItems?: NavSubItem[];
};

export function getNavItems(user: { subscription_plan?: string } | null): NavItem[] {
    return [
        {
            label: 'Dashboard',
            href: '/customer/dashboard',
            icon: "/img/dashboard.svg",
        },
        ...(user?.subscription_plan === 'business_card' || user?.subscription_plan === 'both' ? [
            {
                label: 'BC Services',
                href: '/customer/dashboard/services',
                icon: "/img/services.svg",
            },
        ] : []),
        ...(user?.subscription_plan === 'menu' || user?.subscription_plan === 'both' ? [
            {
                label: 'Menu',
                href: '/customer/dashboard/menu',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu h-5 w-5"><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                ),
            },
        ] : []),
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-4 w-4"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                    ),
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
}
