import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function SuperAdminDashboard() {
    return <div>Super Admin Dashboard Content</div>;
}
