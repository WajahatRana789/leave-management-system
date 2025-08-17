import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Building2, CalendarCheck2, CalendarClock, CalendarX2, User, Users, UserSquare2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
interface Props {
    today: string;

    totalUsers: number;
    totalManagers: number;
    totalShiftIncharges: number;
    totalEmployees: number;

    totalShifts: number;

    leaveStats: {
        total_requests: number;
        approved: number;
        rejected: number;
        pending: number;
    };

    onLeaveToday: {
        id: number;
        user: { name: string };
        leave_type: { name: string };
        from_date: string;
        to_date: string;
    }[];

    upcomingLeaves: {
        id: number;
        user: { name: string };
        leave_type: { name: string };
        from_date: string;
        to_date: string;
    }[];

    lieuOffStats: {
        available: number;
        pending: number;
        expired: number;
        used: number;
    };
}

export default function SuperAdminDashboard({
    today,
    totalUsers,
    totalManagers,
    totalShiftIncharges,
    totalEmployees,
    totalShifts,
    leaveStats,
    onLeaveToday,
    upcomingLeaves,
    lieuOffStats,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-gray-600">Today: {today}</p>
                    </div>

                    {/* Top Stats */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <Users className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Total Users</p>
                                    <p className="text-lg font-bold">{totalUsers}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <UserSquare2 className="h-8 w-8 text-purple-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Shift Incharges</p>
                                    <p className="text-lg font-bold">{totalShiftIncharges}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <User className="h-8 w-8 text-orange-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Employees</p>
                                    <p className="text-lg font-bold">{totalEmployees}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <Building2 className="h-8 w-8 text-pink-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Shifts</p>
                                    <p className="text-lg font-bold">{totalShifts}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leave Stats */}
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="mb-3 text-lg font-semibold">Leave Requests ({leaveStats.total_requests})</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="flex items-center gap-2">
                                    <CalendarCheck2 className="h-6 w-6 text-green-500" />
                                    <span className="font-medium">Approved: {leaveStats.approved}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-6 w-6 text-yellow-500" />
                                    <span className="font-medium">Pending: {leaveStats.pending}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarX2 className="h-6 w-6 text-red-500" />
                                    <span className="font-medium">Rejected: {leaveStats.rejected}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today on Leave */}
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="mb-3 text-lg font-semibold">On Leave Today</h2>
                            {onLeaveToday.length > 0 ? (
                                <ul className="divide-y">
                                    {onLeaveToday.map((leave) => (
                                        <li key={leave.id} className="flex justify-between py-2">
                                            <span>{leave.user.name}</span>
                                            <span className="text-sm text-gray-600">{leave.leave_type.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No one is on leave today.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Leaves */}
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="mb-3 text-lg font-semibold">Upcoming Leaves (Next 7 Days)</h2>
                            {upcomingLeaves.length > 0 ? (
                                <ul className="divide-y">
                                    {upcomingLeaves.map((leave) => (
                                        <li key={leave.id} className="flex justify-between py-2">
                                            <span>{leave.user.name}</span>
                                            <span className="text-sm text-gray-600">
                                                {leave.leave_type.name} ({leave.from_date} → {leave.to_date})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No upcoming leaves.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Lieu Off Stats */}
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="mb-3 text-lg font-semibold">Lieu Off Stats</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Available</p>
                                    <p className="text-lg font-bold text-green-600">{lieuOffStats.available}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-lg font-bold text-yellow-600">{lieuOffStats.pending}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Used</p>
                                    <p className="text-lg font-bold text-blue-600">{lieuOffStats.used}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Expired</p>
                                    <p className="text-lg font-bold text-red-600">{lieuOffStats.expired}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
