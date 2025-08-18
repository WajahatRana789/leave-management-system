import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDisplay } from '@/lib/date';
import { Head } from '@inertiajs/react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { BarChart3, Briefcase, Building2, CalendarClock, CalendarDays, Clock, Layers3, User, Users, UserSquare2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    today: string;
    user: any;

    // Users
    totalUsers: number;
    totalShiftIncharges: number;
    totalEmployees: number;
    activeUsers: number;
    userGrowth: {
        this_month: number;
        last_month: number;
        this_year: number;
        last_year: number;
    };
    roleDistribution: Record<string, number>;

    // Shifts
    totalShifts: number;
    shiftsWithoutIncharge: number;
    shiftStats: {
        id: number;
        name: string;
        users_count: number;
    }[];

    // Leave Stats
    leaveStats: {
        total_requests: number;
        approved: number;
        rejected: number;
        pending: number;
        total_days: number;
    };
    leaveTypeStats: {
        id: number;
        name: string;
        key: string;
        default_days: number;
        total_requests: number;
        approved_requests: number;
        rejected_requests: number;
        pending_requests: number;
    }[];
    monthlyLeaveTrends: {
        month: number;
        total: number;
        approved: number;
        rejected: number;
        pending: number;
    }[];

    // Today & Upcoming
    onLeaveToday: {
        id: number;
        user: {
            name: string;
            shift?: { name: string };
        };
        leave_type: { name: string };
        from_date: string;
        to_date: string;
    }[];
    upcomingLeaves: {
        id: number;
        user: {
            name: string;
            shift?: { name: string };
        };
        leave_type: { name: string };
        from_date: string;
        to_date: string;
        status: string;
    }[];

    // Lieu Off
    lieuOffStats: {
        available: number;
        pending: number;
        expired: number;
        used: number;
        total_granted: number;
    };

    // Designations
    designationStats: {
        id: number;
        title: string;
        users_count: number;
    }[];
}

export default function SuperAdminDashboard({
    today,
    user,
    totalUsers,
    totalShiftIncharges,
    totalEmployees,
    activeUsers,
    userGrowth,
    roleDistribution,
    totalShifts,
    shiftsWithoutIncharge,
    shiftStats,
    leaveStats,
    leaveTypeStats,
    monthlyLeaveTrends,
    onLeaveToday,
    upcomingLeaves,
    lieuOffStats,
    designationStats,
}: Props) {
    // Prepare data for charts
    const roleDistributionData = {
        labels: Object.keys(roleDistribution),
        datasets: [
            {
                data: Object.values(roleDistribution),
                backgroundColor: [
                    '#3b82f6', // blue
                    '#8b5cf6', // purple
                    '#ec4899', // pink
                    '#14b8a6', // teal
                ],
            },
        ],
    };

    const leaveTypeData = {
        labels: leaveTypeStats.map((lt) => lt.name),
        datasets: [
            {
                label: 'Approved',
                data: leaveTypeStats.map((lt) => lt.approved_requests),
                backgroundColor: '#10b981', // green
            },
            {
                label: 'Pending',
                data: leaveTypeStats.map((lt) => lt.pending_requests),
                backgroundColor: '#f59e0b', // yellow
            },
            {
                label: 'Rejected',
                data: leaveTypeStats.map((lt) => lt.rejected_requests),
                backgroundColor: '#ef4444', // red
            },
        ],
    };

    const monthlyTrendsData = {
        labels: monthlyLeaveTrends.map((m) => new Date(2023, m.month - 1).toLocaleString('default', { month: 'short' })),
        datasets: [
            {
                label: 'Approved',
                data: monthlyLeaveTrends.map((m) => m.approved),
                backgroundColor: '#10b981',
            },
            {
                label: 'Pending',
                data: monthlyLeaveTrends.map((m) => m.pending),
                backgroundColor: '#f59e0b',
            },
            {
                label: 'Rejected',
                data: monthlyLeaveTrends.map((m) => m.rejected),
                backgroundColor: '#ef4444',
            },
        ],
    };

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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
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

                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <Briefcase className="h-8 w-8 text-indigo-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Designations</p>
                                    <p className="text-lg font-bold">{designationStats.length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leave Stats */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardContent className="p-4">
                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <BarChart3 className="h-5 w-5" /> Leave Overview
                                </h2>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Requests</p>
                                        <p className="text-lg font-bold">{leaveStats.total_requests}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Approved</p>
                                        <p className="text-lg font-bold text-green-600">{leaveStats.approved}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Pending</p>
                                        <p className="text-lg font-bold text-yellow-600">{leaveStats.pending}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Rejected</p>
                                        <p className="text-lg font-bold text-red-600">{leaveStats.rejected}</p>
                                    </div>
                                    <div className="md:col-span-4">
                                        <p className="text-sm text-gray-500">Total Days Taken</p>
                                        <p className="text-lg font-bold">{leaveStats.total_days}</p>
                                    </div>
                                </div>

                                <h3 className="text-md mt-4 mb-2 font-medium">Monthly Trends</h3>
                                <div className="h-64">
                                    <Bar
                                        data={monthlyTrendsData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                x: { stacked: true },
                                                y: { stacked: true },
                                            },
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <Layers3 className="h-5 w-5" /> Leave Types
                                </h2>
                                <div className="h-64">
                                    <Bar
                                        data={leaveTypeData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                x: { stacked: true },
                                                y: { stacked: true },
                                            },
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Today on Leave & Upcoming Leaves */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <CalendarDays className="h-5 w-5" /> On Leave Today ({onLeaveToday.length})
                                </h2>
                                {onLeaveToday.length > 0 ? (
                                    <div className="space-y-2">
                                        {onLeaveToday.map((leave) => (
                                            <div key={leave.id} className="rounded border p-3">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{leave.user.name}</span>
                                                    <span className="text-sm text-gray-600">{leave.leave_type.name}</span>
                                                </div>
                                                {leave.user.shift && <p className="mt-1 text-sm text-gray-500">Shift: {leave.user.shift.name}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No one is on leave today.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <CalendarClock className="h-5 w-5" /> Upcoming Leaves ({upcomingLeaves.length})
                                </h2>
                                {upcomingLeaves.length > 0 ? (
                                    <div className="space-y-2">
                                        {upcomingLeaves.map((leave) => (
                                            <div key={leave.id} className="rounded border p-3">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{leave.user.name}</span>
                                                    <span
                                                        className={`text-sm ${
                                                            leave.status === 'approved'
                                                                ? 'text-green-600'
                                                                : leave.status === 'pending'
                                                                  ? 'text-yellow-600'
                                                                  : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {leave.leave_type.name}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {formatDisplay(leave.from_date)} → {formatDisplay(leave.to_date)}
                                                </p>
                                                {leave.user.shift && <p className="mt-1 text-sm text-gray-500">Shift: {leave.user.shift.name}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No upcoming leaves.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Shifts, Designations & Lieu Off Stats */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <Building2 className="h-5 w-5" /> Shifts ({totalShifts})
                                </h2>
                                <p className="mb-2 text-sm text-gray-500">{shiftsWithoutIncharge} shift(s) without incharge</p>
                                <div className="space-y-2">
                                    {shiftStats.map((shift) => (
                                        <div key={shift.id} className="flex justify-between border-b pb-2">
                                            <span>{shift.name}</span>
                                            <span className="text-sm text-gray-600">{shift.users_count} members</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <Briefcase className="h-5 w-5" /> Designations ({designationStats.length})
                                </h2>
                                <div className="space-y-2">
                                    {designationStats.map((designation) => (
                                        <div key={designation.id} className="flex justify-between border-b pb-2">
                                            <span>{designation.title}</span>
                                            <span className="text-sm text-gray-600">{designation.users_count} users</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <Clock className="h-5 w-5" /> Lieu Off Stats
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
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
                                    <div className="col-span-2 text-center">
                                        <p className="text-sm text-gray-500">Total Granted</p>
                                        <p className="text-lg font-bold">{lieuOffStats.total_granted}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
