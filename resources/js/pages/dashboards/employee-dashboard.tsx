import EmployeeLeaveCalendar from '@/components/EmployeeLeaveCalendar';
import AppLayout from '@/layouts/app-layout';
import { formatDisplay } from '@/lib/date';
import { LeaveBalance, LeaveRequest, ShiftInfo, TeamMemberOnLeave, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, CalendarDays, Clock, FileText, Mail, MessageSquare, Phone, PlusCircle, User, Users } from 'lucide-react';

import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function EmployeeDashboard() {
    const {
        today,
        user,
        leaveBalances,
        lieuOffBalance,
        recentLeaves,
        teamOnLeaveToday,
        shiftInfo,
        designationInfo,
        calendarLeaves,
        teamCalendarLeaves,
    } = usePage().props as {
        leaveBalances: LeaveBalance[];
        lieuOffBalance: LieuOffBalance[];
        recentLeaves: LeaveRequest[];
        teamOnLeaveToday: TeamMemberOnLeave[];
        shiftInfo: ShiftInfo | null;
        designationInfo: DesignationInfo | null;
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
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <div className="mb-0 text-sm text-gray-600">{today}</div>
                        </div>
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
                        <h2 className="text-lg font-semibold">My Leave Balance</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Regular Leave Balances */}
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

                            {/* Lieu Off Balance Card */}
                            <Link
                                href={route('my-lieu-offs.index')}
                                className="block rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                            >
                                <p className="mb-1 text-sm text-gray-600">Lieu Leave</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 px-2 py-1">
                                        <span className="text-green-700">Available</span>
                                        <span className="font-bold text-green-800">{lieuOffBalance.available}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-yellow-200 bg-yellow-50 px-2 py-1">
                                        <span className="text-yellow-700">Pending</span>
                                        <span className="font-bold text-yellow-800">{lieuOffBalance.pending}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-red-200 bg-red-50 px-2 py-1">
                                        <span className="text-red-700">Expired</span>
                                        <span className="font-bold text-red-800">{lieuOffBalance.expired}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 px-2 py-1">
                                        <span className="text-blue-700">Used</span>
                                        <span className="font-bold text-blue-800">{lieuOffBalance.used}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </section>

                    {/* Rest of your sections... */}
                    <section>
                        <h2 className="mb-2 text-lg font-semibold">My Pending Requests</h2>
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
                        <h2 className="mb-2 text-lg font-semibold">My Recent Leave History</h2>
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
                                            <td className="p-3 text-gray-600">{entry.reviewed_at ? formatDisplay(entry.reviewed_at) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold">My Shift Members on Leave Today</h2>
                        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow">
                            <Users className="h-6 w-6 text-indigo-500" />
                            {teamOnLeaveToday.length > 0 ? (
                                <p>
                                    <span className="font-semibold">{teamOnLeaveToday.length}</span> teammates on leave today:{' '}
                                    {teamOnLeaveToday.map((t, i) => (
                                        <span key={i} className="ml-1 text-sm font-medium text-gray-700">
                                            {t.user.name} ({t.leave_type.name}){i < teamOnLeaveToday.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-600">No one is on leave today 🎉</p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold">My Info</h2>
                        <div className="space-y-2 rounded-xl border bg-white p-4 shadow">
                            <p className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span>
                                    <strong>Name:</strong> {user.name}
                                </span>
                            </p>

                            <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>
                                    <strong>Email:</strong> {user.email}
                                </span>
                            </p>

                            {user.phone && (
                                <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>
                                        <strong>Phone:</strong> {user.phone}
                                    </span>
                                </p>
                            )}

                            {user.whatsapp && (
                                <p className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-green-500" />
                                    <span>
                                        <strong>Whatsapp:</strong> {user.whatsapp}
                                    </span>
                                </p>
                            )}

                            {designationInfo && (
                                <p className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-gray-500" />
                                    <span>
                                        <strong>Designation:</strong> {designationInfo.title}
                                    </span>
                                </p>
                            )}

                            {shiftInfo && (
                                <>
                                    <p className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span>
                                            <strong>Shift:</strong> {shiftInfo.name}
                                        </span>
                                    </p>
                                    {shiftInfo.manager && (
                                        <p className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span>
                                                <strong>Shift Incharge:</strong> {shiftInfo.manager.name} ({shiftInfo.manager.email})
                                            </span>
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
