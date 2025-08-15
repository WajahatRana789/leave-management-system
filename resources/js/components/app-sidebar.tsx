import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck2, CalendarPlus, Clock, LayoutGrid, List, ListChecks, Send, Users2Icon } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: Users2Icon,
    },
    {
        title: 'Shifts',
        href: '/shifts',
        icon: Clock,
    },
    {
        title: 'Leave Types',
        href: '/leave-types',
        icon: CalendarCheck2,
    },
];

const employeeNavItems: NavItem[] = [
    {
        title: 'My Leave Requests',
        href: '/my-leave-requests',
        icon: List,
    },
    {
        title: 'My Lieu Offs',
        href: '/my-lieu-offs',
        icon: List,
    },
    {
        title: 'Request For Leave',
        href: '/leave-requests/create',
        icon: Send,
    },
];

const managerNavItems: NavItem[] = [
    {
        title: 'Lieu Leaves',
        href: '/lieu-leaves',
        icon: CalendarPlus,
    },
    {
        title: 'Employee Leave Requests',
        href: '/employee-leave-requests',
        icon: ListChecks,
    },
];

const footerNavItems: NavItem[] = [
    // ... your footer items
];

export function AppSidebar() {
    // Get the authenticated user from Inertia
    const { user } = usePage().props.auth;

    // Determine role-specific items
    const roleSpecificItems = [];

    if (user.role === 'super_admin') {
        roleSpecificItems.push(...adminNavItems);
    }

    if (['manager', 'super_admin', 'admin'].includes(user.role)) {
        roleSpecificItems.push(...managerNavItems);
    }

    // Only show employee nav items for non-admin users
    const userSpecificItems = ['employee', 'manager'].includes(user.role) ? employeeNavItems : [];

    // Combine nav items
    const mainNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...roleSpecificItems,
        ...userSpecificItems,
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
