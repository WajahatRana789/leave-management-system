import EmployeeLeaveCalendar from '@/components/EmployeeLeaveCalendar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatDisplay } from '@/lib/date';
import { LeaveRequest, TeamMemberOnLeave, type BreadcrumbItem } from '@/types';
import { Dialog } from '@headlessui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, Briefcase, CalendarDays, Clock, FileText, Mail, MessageSquare, Phone, PlusCircle, User } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface TeamLeaveStats {
    total_requests: number;
    approved: number;
    rejected: number;
    pending: number;
}

export default function ShiftInchargeDashboard() {
    const {
        today,
        user,
        shiftName,
        leaveBalances,
        lieuOffBalance,
        recentLeaves,
        designationInfo,
        teamCount,
        pendingRequests,
        teamLeaveStats,
        teamOnLeaveToday,
        upcomingLeaves,
        teamCalendarLeaves,
    } = usePage().props as {
        today: string;
        teamCount: number;
        pendingRequests: LeaveRequest[];
        teamLeaveStats: TeamLeaveStats;
        teamOnLeaveToday: TeamMemberOnLeave[];
        upcomingLeaves: LeaveRequest[];
        teamCalendarLeaves: LeaveRequest[];
    };

    const [showModal, setShowModal] = useState(false);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [remarks, setRemarks] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const oldestPending = pendingRequests.length ? Math.min(...pendingRequests.map((r) => new Date(r.created_at).getTime())) : null;

    const formatDateRange = (from: string, to: string) => {
        return from === to ? formatDisplay(from) : `${formatDisplay(from)} - ${formatDisplay(to)}`;
    };

    const handleApprove = (id: number) => {
        if (confirm('Are you sure you want to approve this leave request?')) {
            router.post(`/leave-requests/${id}/approve`);
        }
    };

    const openRejectModal = (id: number) => {
        setRejectingId(id);
        setShowModal(true);
    };

    const submitRejection = () => {
        if (!remarks.trim()) {
            alert('Please enter remarks for rejection.');
            return;
        }

        router.post(`/leave-requests/${rejectingId}/reject`, { remarks });
        setShowModal(false);
        setRemarks('');
        setRejectingId(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setRejectingId(null);
        setRemarks('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <Tabs defaultValue="my_dashboard">
                        <TabsList>
                            <TabsTrigger value="my_dashboard">My Dashboard</TabsTrigger>
                            <TabsTrigger value="team_dashboard">Team Dashboard</TabsTrigger>
                        </TabsList>
                        <TabsContent value="my_dashboard">
                            <div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold">My Dashboard</h1>
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
                                            {/* <button
                                                onClick={() => setShowCalendar(!showCalendar)}
                                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-white shadow hover:bg-blue-700"
                                            >
                                                <CalendarDays className="h-4 w-4" />
                                                {showCalendar ? 'Hide Calendar View' : 'Show Calendar View'}
                                            </button> */}
                                        </div>
                                    </div>

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
                                                        {oldestPending
                                                            ? `${Math.floor((Date.now() - oldestPending) / (1000 * 60 * 60 * 24))} days ago`
                                                            : 'N/A'}
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
                                                            <td className="p-3 text-gray-600">
                                                                {entry.reviewed_at ? formatDisplay(entry.reviewed_at) : '-'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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
                                            <p className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span>
                                                    <strong>Shift:</strong> {shiftName}
                                                </span>
                                            </p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="team_dashboard">
                            <div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold">Team Dashboard</h1>
                                            <div className="mb-0 text-sm text-gray-600">{today}</div>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={() => setShowCalendar(!showCalendar)}
                                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-white shadow hover:bg-blue-700"
                                            >
                                                <CalendarDays className="h-4 w-4" />
                                                {showCalendar ? 'Hide Team Calendar' : 'Show Team Calendar'}
                                            </button>
                                        </div>
                                    </div>

                                    {showCalendar && (
                                        <div>
                                            <EmployeeLeaveCalendar leaves={[]} teamLeaves={teamCalendarLeaves} />
                                        </div>
                                    )}

                                    <section className="space-y-2">
                                        <h2 className="text-lg font-semibold">Team Overview</h2>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                            <div className="rounded-lg border bg-white p-4 shadow">
                                                <p className="mb-1 text-sm text-gray-600">Team Members</p>
                                                <p className="text-xl font-bold">{teamCount}</p>
                                            </div>
                                            <div className="rounded-lg border bg-white p-4 shadow">
                                                <p className="mb-1 text-sm text-gray-600">Total Leave Requests</p>
                                                <p className="text-xl font-bold">{teamLeaveStats.total_requests}</p>
                                            </div>
                                            <div className="rounded-lg border bg-white p-4 shadow">
                                                <p className="mb-1 text-sm text-gray-600">Approved Requests</p>
                                                <p className="text-xl font-bold text-green-700">{teamLeaveStats.approved}</p>
                                            </div>
                                            <div className="rounded-lg border bg-white p-4 shadow">
                                                <p className="mb-1 text-sm text-gray-600">Rejected Requests</p>
                                                <p className="text-xl font-bold text-red-700">{teamLeaveStats.rejected}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">Pending Approvals</h2>
                                            <Link href="/employee-leave-requests" className="text-sm text-blue-600 hover:text-blue-800">
                                                View All
                                            </Link>
                                        </div>
                                        <div className="flex flex-col gap-4 md:flex-row">
                                            <div className="flex flex-1 items-center gap-3 rounded-xl border bg-white p-4 shadow">
                                                <AlertCircle className="h-6 w-6 text-yellow-500" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Pending Approvals</p>
                                                    <p className="text-xl font-bold">{pendingRequests.length}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-1 items-center gap-3 rounded-xl border bg-white p-4 shadow">
                                                <Clock className="h-6 w-6 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Oldest Request</p>
                                                    <p className="text-xl font-bold">
                                                        {oldestPending
                                                            ? `${Math.floor((Date.now() - oldestPending) / (1000 * 60 * 60 * 24))} days ago`
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {pendingRequests.length > 0 && (
                                            <div className="mt-4 overflow-x-auto rounded-xl border bg-white shadow">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead className="bg-gray-100 text-gray-700">
                                                        <tr>
                                                            <th className="p-3">Employee</th>
                                                            <th className="p-3">Type</th>
                                                            <th className="p-3">From</th>
                                                            <th className="p-3">To</th>
                                                            <th className="p-3">Days</th>
                                                            <th className="p-3">Reason</th>
                                                            <th className="px-4 py-2">Status</th>
                                                            <th className="px-4 py-2">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pendingRequests.map((request) => (
                                                            <tr key={request.id} className="border-t">
                                                                <td className="p-3">{request.user.name}</td>
                                                                <td className="p-3">{request.leave_type.name}</td>
                                                                <td className="p-3">{formatDisplay(request.from_date)}</td>
                                                                <td className="p-3">{formatDisplay(request.to_date)}</td>
                                                                <td className="p-3">{request.total_days}</td>
                                                                <td className="px-4 py-2">{request.reason}</td>
                                                                <td className="px-4 py-2 capitalize">
                                                                    <span
                                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                            request.status === 'approved'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : request.status === 'rejected'
                                                                                  ? 'bg-red-100 text-red-800'
                                                                                  : 'bg-yellow-100 text-yellow-800'
                                                                        }`}
                                                                    >
                                                                        {request.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <div className="flex gap-2">
                                                                        <Button size="sm" variant="outline" asChild>
                                                                            <Link href={route('leave-requests.employee.show', request.id)}>View</Link>
                                                                        </Button>
                                                                        {request.status === 'pending' && (
                                                                            <>
                                                                                <Button size="sm" onClick={() => handleApprove(request.id)}>
                                                                                    Approve
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="destructive"
                                                                                    onClick={() => openRejectModal(request.id)}
                                                                                >
                                                                                    Reject
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </section>

                                    <section>
                                        <h2 className="text-lg font-semibold">Team on Leave Today</h2>
                                        {teamOnLeaveToday.length > 0 ? (
                                            <div className="overflow-x-auto rounded-xl border bg-white shadow">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead className="bg-gray-100 text-gray-700">
                                                        <tr>
                                                            <th className="p-3">Employee</th>
                                                            <th className="p-3">Leave Type</th>
                                                            <th className="p-3">Dates</th>
                                                            <th className="p-3">Days</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {teamOnLeaveToday.map((leave) => (
                                                            <tr key={leave.id} className="border-t">
                                                                <td className="p-3">{leave.user.name}</td>
                                                                <td className="p-3">{leave.leave_type.name}</td>
                                                                <td className="p-3">{formatDateRange(leave.from_date, leave.to_date)}</td>
                                                                <td className="p-3">{leave.total_days}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border bg-white p-4 text-center text-gray-500">
                                                No team members on leave today
                                            </div>
                                        )}
                                    </section>

                                    <section>
                                        <h2 className="text-lg font-semibold">Upcoming Leaves (Next 7 Days)</h2>
                                        {upcomingLeaves.length > 0 ? (
                                            <div className="overflow-x-auto rounded-xl border bg-white shadow">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead className="bg-gray-100 text-gray-700">
                                                        <tr>
                                                            <th className="p-3">Employee</th>
                                                            <th className="p-3">Leave Type</th>
                                                            <th className="p-3">Dates</th>
                                                            <th className="p-3">Days</th>
                                                            <th className="p-3">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {upcomingLeaves.map((leave) => (
                                                            <tr key={leave.id} className="border-t">
                                                                <td className="p-3">{leave.user.name}</td>
                                                                <td className="p-3">{leave.leave_type.name}</td>
                                                                <td className="p-3">{formatDateRange(leave.from_date, leave.to_date)}</td>
                                                                <td className="p-3">{leave.total_days}</td>
                                                                <td className="p-3">
                                                                    <span
                                                                        className={`rounded px-2 py-1 text-xs font-medium ${
                                                                            leave.status === 'approved'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : leave.status === 'rejected'
                                                                                  ? 'bg-red-100 text-red-700'
                                                                                  : 'bg-yellow-100 text-yellow-700'
                                                                        }`}
                                                                    >
                                                                        {leave.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border bg-white p-4 text-center text-gray-500">
                                                No upcoming leaves in the next 7 days
                                            </div>
                                        )}
                                    </section>

                                    <Dialog open={showModal} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center">
                                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                                        <div className="z-10 mx-auto w-full max-w-md rounded-lg bg-white p-6">
                                            <Dialog.Title className="mb-2 text-lg font-bold">Reject Leave Request</Dialog.Title>
                                            <p className="mb-4 text-sm text-gray-600">Please write your remarks regarding rejecting this leave:</p>
                                            <textarea
                                                className="w-full rounded border p-2 text-sm"
                                                rows={4}
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                placeholder="Enter remarks..."
                                            />
                                            <div className="mt-4 flex justify-end gap-2">
                                                <Button variant="outline" onClick={closeModal}>
                                                    Cancel
                                                </Button>
                                                <Button variant="destructive" onClick={submitRejection}>
                                                    Submit
                                                </Button>
                                            </div>
                                        </div>
                                    </Dialog>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
