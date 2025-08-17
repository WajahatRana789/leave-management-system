import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDisplay } from '@/lib/date';
import { Dialog } from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Check, Clock, FileText, User, X } from 'lucide-react';
import { useState } from 'react';
interface User {
    id: number;
    name: string;
    email: string;
}

interface LeaveType {
    name: string;
    description?: string;
}

interface LeaveRequest {
    id: number;
    user: User;
    leave_type: LeaveType;
    from_date: string;
    to_date: string;
    total_days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by?: User;
    reviewed_at?: string;
    remarks?: string;
    created_at: string;
}

interface Props {
    request: LeaveRequest;
    canReview: boolean;
    authUser: {
        id: number;
        role: string;
        name: string;
    };
}

export default function EmployeeRequestShow({ request, canReview, authUser }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [remarks, setRemarks] = useState('');

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this leave request?')) {
            router.post(route('leave-requests.approve', request.id));
        }
    };

    const openRejectModal = () => {
        setShowModal(true);
    };

    const submitRejection = () => {
        if (!remarks.trim()) {
            alert('Please enter remarks for rejection.');
            return;
        }

        router.post(route('leave-requests.reject', request.id), { remarks });
        setShowModal(false);
        setRemarks('');
    };

    const closeModal = () => {
        setShowModal(false);
        setRemarks('');
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout>
            <Head title="Leave Request Details" />
            <div className="p-4">
                {/* Rejection Modal */}
                <Dialog open={showModal} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="z-10 w-full max-w-md rounded-lg bg-white p-6">
                        <Dialog.Title className="mb-2 text-lg font-bold">Reject Leave Request</Dialog.Title>
                        <p className="mb-4 text-sm text-gray-600">Please provide remarks for rejecting {request.user.name}'s leave request:</p>
                        <textarea
                            className="w-full rounded border p-2 text-sm"
                            rows={4}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Enter rejection remarks..."
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={submitRejection}>
                                Confirm Reject
                            </Button>
                        </div>
                    </div>
                </Dialog>

                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('leave-requests.employee.index')} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Employee Requests
                    </Link>

                    {canReview && request.status === 'pending' && (
                        <div className="flex gap-2">
                            <Button onClick={handleApprove}>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                            <Button variant="destructive" onClick={openRejectModal}>
                                <X className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {request.user.name}'s {request.leave_type.name}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">Submitted on {formatDisplay(request.created_at)}</p>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColors[request.status]}`}>
                                {request.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center text-lg font-medium text-gray-900">
                                    <User className="mr-2 h-5 w-5 text-gray-400" />
                                    Employee Details
                                </h3>
                                <dl className="mt-2 space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                                        <dd className="text-sm text-gray-900">{request.user.name}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="text-sm text-gray-900">{request.user.email}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Leave Type</dt>
                                        <dd className="text-sm text-gray-900">{request.leave_type.name}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div>
                                <h3 className="flex items-center text-lg font-medium text-gray-900">
                                    <CalendarDays className="mr-2 h-5 w-5 text-gray-400" />
                                    Dates
                                </h3>
                                <dl className="mt-2 space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">From</dt>
                                        <dd className="text-sm text-gray-900">{formatDisplay(request.from_date)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">To</dt>
                                        <dd className="text-sm text-gray-900">{formatDisplay(request.to_date)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Total Days</dt>
                                        <dd className="text-sm text-gray-900">{request.total_days}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center text-lg font-medium text-gray-900">
                                    <FileText className="mr-2 h-5 w-5 text-gray-400" />
                                    Reason
                                </h3>
                                <p className="mt-2 rounded bg-gray-50 p-3 text-sm text-gray-700">{request.reason || 'No reason provided'}</p>
                            </div>

                            {request.status !== 'pending' && (
                                <div>
                                    <h3 className="flex items-center text-lg font-medium text-gray-900">
                                        <Clock className="mr-2 h-5 w-5 text-gray-400" />
                                        Review Details
                                    </h3>
                                    <dl className="mt-2 space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Reviewed By</dt>
                                            <dd className="text-sm text-gray-900">{request.reviewed_by?.name || 'N/A'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Reviewed On</dt>
                                            <dd className="text-sm text-gray-900">
                                                {request.reviewed_at ? formatDisplay(request.reviewed_at) : 'N/A'}
                                            </dd>
                                        </div>
                                        {request.remarks && (
                                            <div className="flex flex-col">
                                                <dt className="text-sm font-medium text-gray-500">Remarks</dt>
                                                <dd className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-700">{request.remarks}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
