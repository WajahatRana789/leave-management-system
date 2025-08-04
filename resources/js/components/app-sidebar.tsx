import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck2, Clock, FilePlus2, LayoutGrid, List, PlusCircle, Send, UserPlus, Users2Icon } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: Users2Icon,
    },
    {
        title: 'Create User',
        href: '/users/create',
        icon: UserPlus,
    },
    {
        title: 'Shifts',
        href: '/shifts',
        icon: Clock,
    },
    {
        title: 'Create Shift',
        href: '/shifts/create',
        icon: PlusCircle,
    },
    {
        title: 'Leave Types',
        href: '/leave-types',
        icon: CalendarCheck2,
    },
    {
        title: 'Create Leave Type',
        href: '/leave-types/create',
        icon: FilePlus2,
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Leave Requests',
        href: '/leave-requests',
        icon: List,
    },
    {
        title: 'Request For Leave',
        href: '/leave-requests/create',
        icon: Send,
    },
];

const footerNavItems: NavItem[] = [
    // ... your footer items
];

export function AppSidebar() {
    // Get the authenticated user from Inertia
    const { user } = usePage().props.auth;

    // Combine nav items based on user role
    const mainNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...(user.role === 'super_admin' ? adminNavItems : []),
        ...userNavItems,
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
