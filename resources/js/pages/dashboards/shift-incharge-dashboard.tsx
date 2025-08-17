import EmployeeLeaveCalendar from '@/components/EmployeeLeaveCalendar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDisplay } from '@/lib/date';
import { LeaveRequest, TeamMemberOnLeave, type BreadcrumbItem } from '@/types';
import { Dialog } from '@headlessui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, CalendarDays, Clock } from 'lucide-react';
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
    const { today, teamCount, pendingRequests, teamLeaveStats, teamOnLeaveToday, upcomingLeaves, teamCalendarLeaves } = usePage().props as {
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
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Dashboard</h1>
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
                                        {oldestPending ? `${Math.floor((Date.now() - oldestPending) / (1000 * 60 * 60 * 24))} days ago` : 'N/A'}
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
                                                                <Button size="sm" variant="destructive" onClick={() => openRejectModal(request.id)}>
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
                            <div className="rounded-xl border bg-white p-4 text-center text-gray-500">No team members on leave today</div>
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
                            <div className="rounded-xl border bg-white p-4 text-center text-gray-500">No upcoming leaves in the next 7 days</div>
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
        </AppLayout>
    );
}
