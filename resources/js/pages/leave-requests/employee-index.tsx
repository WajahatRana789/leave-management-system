import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Dialog } from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function EmployeeLeaveRequests({ requests, authUser, canReview }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [remarks, setRemarks] = useState('');

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
        <AppLayout>
            <Head title="Employee Leave Requests" />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">{authUser.role === 'manager' ? 'Team Leave Requests' : 'Employee Leave Requests'}</h1>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2">Employee</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">From</th>
                                <th className="px-4 py-2">To</th>
                                <th className="px-4 py-2">Days</th>
                                <th className="px-4 py-2">Reason</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.data.map((request) => (
                                <tr key={request.id}>
                                    <td className="px-4 py-2">{request.user.name}</td>
                                    <td className="px-4 py-2">{request.leave_type.name}</td>
                                    <td className="px-4 py-2">{request.from_date}</td>
                                    <td className="px-4 py-2">{request.to_date}</td>
                                    <td className="px-4 py-2">{request.total_days}</td>
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
                                            {canReview && request.status === 'pending' && (
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

                {/* Modal for remarks */}
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
        </AppLayout>
    );
}
