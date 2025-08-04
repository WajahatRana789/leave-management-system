import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Clock, FileText, User, X } from 'lucide-react';

interface User {
    id: number;
    name: string;
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
    updated_at: string;
}

interface Props {
    request: LeaveRequest;
    canDelete: boolean;
}

export default function MyRequestShow({ request, canDelete }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this leave request?')) {
            router.delete(`/leave-requests/${request.id}`);
        }
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
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/my-leave-requests" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to My Requests
                    </Link>

                    {canDelete && (
                        <Button variant="destructive" onClick={handleDelete} size="sm">
                            <X className="mr-2 h-4 w-4" />
                            Delete Request
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{request.leave_type.name}</h2>
                                <p className="mt-1 text-sm text-gray-500">Submitted on {new Date(request.created_at).toLocaleDateString()}</p>
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
                                    Request Details
                                </h3>
                                <dl className="mt-2 space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Employee</dt>
                                        <dd className="text-sm text-gray-900">{request.user.name}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Leave Type</dt>
                                        <dd className="text-sm text-gray-900">{request.leave_type.name}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Duration</dt>
                                        <dd className="text-sm text-gray-900">{request.total_days} day(s)</dd>
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
                                        <dd className="text-sm text-gray-900">{new Date(request.from_date).toLocaleDateString()}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">To</dt>
                                        <dd className="text-sm text-gray-900">{new Date(request.to_date).toLocaleDateString()}</dd>
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
                                <p className="mt-2 rounded text-sm text-gray-700">{request.reason || 'No reason provided.'}</p>
                            </div>

                            {request.status !== 'pending' && (
                                <div>
                                    <h3 className="flex items-center text-lg font-medium text-gray-900">
                                        <Clock className="mr-2 h-5 w-5 text-gray-400" />
                                        Review Details
                                    </h3>
                                    <dl className="mt-2 space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="text-sm text-gray-900 capitalize">{request.status}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Reviewed By</dt>
                                            <dd className="text-sm text-gray-900">{request.reviewed_by?.name || 'N/A'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Reviewed On</dt>
                                            <dd className="text-sm text-gray-900">
                                                {request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString() : 'N/A'}
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
