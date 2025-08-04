import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Clock, FileText, PlusCircle, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data (replace with props or Inertia props as needed)
const leaveBalances = [
    { type: 'Annual', used: 7, total: 14 },
    { type: 'Sick', used: 2, total: 8 },
    { type: 'Casual', used: 3, total: 8 },
];

const pendingRequests = {
    count: 2,
    oldest: '3 days',
};

const upcomingLeaves = [
    { date: 'Aug 12–14', type: 'Annual Leave' },
    { date: 'Aug 20', type: 'Sick Leave' },
    { date: 'Sep 5–6', type: 'Casual Leave' },
];

const recentHistory = [
    { date: 'Jul 20–21', type: 'Sick', status: 'Approved', updatedAt: 'Jul 19' },
    { date: 'Jul 10–11', type: 'Annual', status: 'Rejected', updatedAt: 'Jul 9' },
    { date: 'Jun 25', type: 'Casual', status: 'Approved', updatedAt: 'Jun 24' },
    { date: 'Jun 12–14', type: 'Annual', status: 'Approved', updatedAt: 'Jun 11' },
    { date: 'May 30', type: 'Sick', status: 'Rejected', updatedAt: 'May 29' },
];

const teamAvailability = {
    count: 3,
    names: ['Ayesha', 'Hamza', 'Ali'],
};

export default function EmployeeDashboard() {
    return (
        <>
            <Head title="Employee Dashboard" />

            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Welcome to Your Dashboard</h1>

                {/* 1. Leave Balance Summary */}
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Leave Balance</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {leaveBalances.map((leave) => {
                            const remaining = leave.total - leave.used;
                            const percent = (remaining / leave.total) * 100;
                            return (
                                <div key={leave.type} className="rounded-lg border bg-white p-4 shadow">
                                    <p className="mb-1 text-sm text-gray-600">{leave.type} Leave</p>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-xl font-bold text-green-700">
                                            {remaining}/{leave.total} days
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                        <div className="h-2 rounded-full bg-green-500" style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 2. Pending Requests */}
                <section>
                    <h2 className="mb-2 text-lg font-semibold">Pending Requests</h2>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex flex-1 items-center gap-3 rounded-xl border bg-white p-4 shadow">
                            <Clock className="h-6 w-6 text-yellow-500" />
                            <div>
                                <p className="text-sm text-gray-600">Pending Approvals</p>
                                <p className="text-xl font-bold">{pendingRequests.count}</p>
                            </div>
                        </div>
                        <div className="flex flex-1 items-center gap-3 rounded-xl border bg-white p-4 shadow">
                            <FileText className="h-6 w-6 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-600">Oldest Request</p>
                                <p className="text-xl font-bold">{pendingRequests.oldest} waiting</p>
                            </div>
                        </div>
                        <Link
                            href="/leave-requests"
                            className="flex items-center justify-center rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow transition hover:bg-primary/90"
                        >
                            View My Requests
                        </Link>
                    </div>
                </section>

                {/* 3. Upcoming Approved Leaves */}
                <section>
                    <h2 className="mb-2 text-lg font-semibold">Upcoming Leaves</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {upcomingLeaves.map((leave, i) => (
                            <div key={i} className="space-y-1 rounded-xl border bg-white p-4 shadow">
                                <p className="text-base font-medium">{leave.date}</p>
                                <p className="text-sm text-gray-600">{leave.type}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Recent Leave History */}
                <section>
                    <h2 className="mb-2 text-lg font-semibold">Recent Leave History</h2>
                    <div className="overflow-x-auto rounded-xl border bg-white shadow">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3">Dates</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentHistory.map((entry, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="p-3">{entry.date}</td>
                                        <td className="p-3">{entry.type}</td>
                                        <td className="p-3">
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-medium ${
                                                    entry.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-600">{entry.updatedAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 5. Team Availability */}
                <section>
                    <h2 className="mb-2 text-lg font-semibold">Team Availability</h2>
                    <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow">
                        <Users className="h-6 w-6 text-indigo-500" />
                        <p>
                            <span className="font-semibold">{teamAvailability.count}</span> teammates on leave today:
                            {teamAvailability.names.map((name, i) => (
                                <span key={i} className="ml-1 text-sm font-medium text-gray-700">
                                    {name}
                                    {i < teamAvailability.names.length - 1 ? ',' : ''}
                                </span>
                            ))}
                        </p>
                    </div>
                </section>

                {/* 6. Quick Actions */}
                <section>
                    <h2 className="mb-2 text-lg font-semibold">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/leave-requests/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Request Leave
                        </Link>
                        <Link
                            href="/calendar"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                        >
                            <CalendarDays className="h-4 w-4" />
                            View Full Calendar
                        </Link>
                        <a
                            href="/leave-summary/download"
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-600 px-4 py-2 text-white shadow hover:bg-gray-700"
                        >
                            <FileText className="h-4 w-4" />
                            Download Leave Summary
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
}
