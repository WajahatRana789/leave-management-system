import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type LeaveRequest = {
    id: number;
    from_date: string;
    to_date: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_at?: string | null;
    remarks?: string | null;
    total_days?: number;
    leave_type: {
        name: string;
    };
};

export type LeaveBalance = {
    id: number;
    name: string;
    default_days: number;
    used_days: number;
    remaining_days: number;
};

export type TeamMemberOnLeave = {
    user: {
        name: string;
    };
    leave_type: {
        name: string;
    };
};

export type ShiftInfo = {
    name: string;
    shift_incharge?: {
        name: string;
        email: string;
    };
};
