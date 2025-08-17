import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck2, CalendarPlus, Clock, LayoutGrid, List, ListChecks, Send, Users2Icon } from 'lucide-react';
import AppLogo from './app-logo';

const navItems: (NavItem & { roles: string[] })[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ['super_admin', 'admin', 'shift_incharge', 'employee'],
    },
    {
        title: 'Employees',
        href: '/users',
        icon: Users2Icon,
        roles: ['super_admin', 'admin', 'shift_incharge'],
    },
    {
        title: 'Shifts',
        href: '/shifts',
        icon: Clock,
        roles: ['super_admin', 'admin'],
    },
    {
        title: 'Leave Types',
        href: '/leave-types',
        icon: CalendarCheck2,
        roles: ['super_admin', 'admin'],
    },
    {
        title: 'Lieu Leaves',
        href: '/lieu-leaves',
        icon: CalendarPlus,
        roles: ['super_admin', 'admin', 'shift_incharge'],
    },
    {
        title: 'Employee Leave Requests',
        href: '/employee-leave-requests',
        icon: ListChecks,
        roles: ['super_admin', 'admin', 'shift_incharge'],
    },
    {
        title: 'My Leave Requests',
        href: '/my-leave-requests',
        icon: List,
        roles: ['shift_incharge', 'employee'],
    },
    {
        title: 'My Lieu Offs',
        href: '/my-lieu-offs',
        icon: List,
        roles: ['shift_incharge', 'employee'],
    },
    {
        title: 'Request For Leave',
        href: '/leave-requests/create',
        icon: Send,
        roles: ['shift_incharge', 'employee'],
    },
];

const footerNavItems: NavItem[] = [
    // ... your footer items
];

export function AppSidebar() {
    // Get the authenticated user from Inertia
    const { user } = usePage().props.auth;
    const mainNavItems = navItems.filter((item) => item.roles.includes(user.role));

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
