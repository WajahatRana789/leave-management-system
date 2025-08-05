import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AdminDashboard from './dashboards/admin-dashboard';
import EmployeeDashboard from './dashboards/employee-dashboard';
import ManagerDashboard from './dashboards/manager-dashboard';
import SuperAdminDashboard from './dashboards/super-admin-dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { user } = usePage().props.auth;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {user.role === 'employee' && <EmployeeDashboard />}
                {user.role === 'manager' && <ManagerDashboard />}
                {user.role === 'admin' && <AdminDashboard />}
                {user.role === 'super_admin' && <SuperAdminDashboard />}
            </div>
        </AppLayout>
    );
}
