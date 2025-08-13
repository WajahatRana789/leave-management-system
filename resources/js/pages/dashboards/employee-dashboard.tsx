import EmployeeLeaveCalendar from '@/components/EmployeeLeaveCalendar';
import AppLayout from '@/layouts/app-layout';
import { LeaveBalance, LeaveRequest, ShiftInfo, TeamMemberOnLeave, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, Clock, FileText, PlusCircle, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function EmployeeDashboard() {
    const { today, leaveBalances, recentLeaves, teamOnLeaveToday, shiftInfo, calendarLeaves, teamCalendarLeaves } = usePage().props as {
        leaveBalances: LeaveBalance[];
        recentLeaves: LeaveRequest[];
        teamOnLeaveToday: TeamMemberOnLeave[];
        shiftInfo: ShiftInfo | null;
        calendarLeaves: LeaveRequest[];
        teamCalendarLeaves: LeaveRequest[];
    };

    const [showCalendar, setShowCalendar] = useState(false);
    const pendingRequests = recentLeaves.filter((r) => r.status === 'pending');
    const oldestPending = pendingRequests.length ? Math.min(...pendingRequests.map((r) => new Date(r.from_date).getTime())) : null;

    const formatDateRange = (from: string, to: string) => {
        return from === to ? from : `${from} – ${to}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="mb-0 text-sm text-gray-600">{today}</div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/leave-requests/create"
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-white shadow hover:bg-green-700"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Request Leave
                            </Link>
                            <Link
                                href="/my-leave-requests"
                                className="flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-white shadow transition hover:bg-primary/90"
                            >
                                View My Requests
                            </Link>
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-white shadow hover:bg-blue-700"
                            >
                                <CalendarDays className="h-4 w-4" />
                                {showCalendar ? 'Hide Calendar View' : 'Show Calendar View'}
                            </button>
                        </div>
                    </div>

                    {showCalendar && (
                        <div>
                            <EmployeeLeaveCalendar leaves={calendarLeaves} teamLeaves={teamCalendarLeaves} />
                        </div>
                    )}

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Leave Balance</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {leaveBalances.map((leave) => {
                                const percent = leave.default_days ? (leave.remaining_days / leave.default_days) * 100 : 0;
                                return (
                                    <div key={leave.id} className="rounded-lg border bg-white p-4 shadow">
                                        <p className="mb-1 text-sm text-gray-600">{leave.name}</p>
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xl font-bold text-green-700">
                                                {leave.remaining_days}/{leave.default_days} days
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

                    {/* Rest of your sections... */}
                    <section>
                        <h2 className="mb-2 text-lg font-semibold">Pending Requests</h2>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex flex-1 items-center gap-3 rounded-xl border bg-white p-4 shadow">
                                <Clock className="h-6 w-6 text-yellow-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Pending Approvals</p>
                                    <p className="text-xl font-bold">{pendingRequests.length}</p>
                                </div>
                            </div>
                            <div className="flex flex-1 items-center gap-3 rounded-xl border bg-white p-4 shadow">
                                <FileText className="h-6 w-6 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Oldest Request</p>
                                    <p className="text-xl font-bold">
                                        {oldestPending ? `${Math.floor((Date.now() - oldestPending) / (1000 * 60 * 60 * 24))} days ago` : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold">Recent Leave History</h2>
                        <div className="overflow-x-auto rounded-xl border bg-white shadow">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="p-3">Dates</th>
                                        <th className="p-3">Type</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Reviewed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLeaves.map((entry) => (
                                        <tr key={entry.id} className="border-t">
                                            <td className="p-3">{formatDateRange(entry.from_date, entry.to_date)}</td>
                                            <td className="p-3">{entry.leave_type.name}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`rounded px-2 py-1 text-xs font-medium ${
                                                        entry.status === 'approved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : entry.status === 'rejected'
                                                              ? 'bg-red-100 text-red-700'
                                                              : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {entry.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-600">
                                                {entry.reviewed_at ? new Date(entry.reviewed_at).toLocaleDateString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold">Team on Leave Today</h2>
                        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow">
                            <Users className="h-6 w-6 text-indigo-500" />
                            <p>
                                <span className="font-semibold">{teamOnLeaveToday.length}</span> teammates on leave today:{' '}
                                {teamOnLeaveToday.map((t, i) => (
                                    <span key={i} className="ml-1 text-sm font-medium text-gray-700">
                                        {t.user.name} ({t.leave_type.name}){i < teamOnLeaveToday.length - 1 ? ',' : ''}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </section>

                    {shiftInfo && (
                        <section>
                            <h2 className="mb-2 text-lg font-semibold">Shift & Manager Info</h2>
                            <div className="rounded-xl border bg-white p-4 shadow">
                                <p>
                                    <strong>Shift:</strong> {shiftInfo.name}
                                </p>
                                {shiftInfo.manager && (
                                    <p>
                                        <strong>Manager:</strong> {shiftInfo.manager.name} ({shiftInfo.manager.email})
                                    </p>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
