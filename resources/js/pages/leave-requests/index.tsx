import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDisplay } from '@/lib/date';
import { Head, Link, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
}

interface LeaveType {
    name: string;
}

interface LeaveRequest {
    id: number;
    leave_type: LeaveType;
    from_date: string;
    to_date: string;
    total_days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by?: User;
    reviewed_at?: string;
    remarks?: string;
}

interface Props {
    requests: {
        data: LeaveRequest[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    authUser: {
        id: number;
        role: string;
    };
}

export default function MyLeaveRequests({ requests, authUser }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this leave request?')) {
            router.delete(`/leave-requests/${id}`);
        }
    };

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    return (
        <AppLayout>
            <Head title="My Leave Requests" />
            <div className="p-4">
                <div className="align-items-center mb-3 flex justify-between">
                    <h1 className="mb-4 text-2xl font-bold">My Leave Requests</h1>
                    <Button>
                        <Link href="/leave-requests/create">Apply for Leave</Link>
                    </Button>
                </div>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">From</th>
                                <th className="px-4 py-2">To</th>
                                <th className="px-4 py-2">Days</th>
                                <th className="px-4 py-2">Reason</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Submitted on</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.data.map((request) => (
                                <tr key={request.id}>
                                    <td className="px-4 py-2">{request.leave_type.name}</td>
                                    <td className="px-4 py-2">{formatDisplay(request.from_date)}</td>
                                    <td className="px-4 py-2">{formatDisplay(request.to_date)}</td>
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
                                    <td className="px-4 py-2">{formatDisplay(request.created_at)}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={route('leave-requests.show', request.id)}>View</Link>
                                            </Button>
                                            {request.status === 'pending' && (
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(request.id)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex flex-wrap items-center gap-1">
                    <button
                        onClick={() => goToPage(requests.links[1]?.url)}
                        className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                        disabled={requests.current_page === 1}
                    >
                        First
                    </button>
                    <button
                        onClick={() => goToPage(requests.links[requests.current_page - 1]?.url)}
                        className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                        disabled={requests.current_page === 1}
                    >
                        Prev
                    </button>

                    {Array.from({ length: requests.last_page }, (_, i) => i + 1)
                        .filter((page) => page === 1 || page === requests.last_page || Math.abs(page - requests.current_page) <= 1)
                        .reduce<number[]>((acc, page, idx, arr) => {
                            if (idx > 0 && page - arr[idx - 1] > 1) acc.push(-1);
                            acc.push(page);
                            return acc;
                        }, [])
                        .map((page, i) =>
                            page === -1 ? (
                                <span key={i} className="px-2 text-gray-500">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={i}
                                    onClick={() => goToPage(requests.links.find((l) => l.label === String(page))?.url || null)}
                                    className={`rounded border px-3 py-1 text-sm ${
                                        requests.current_page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            ),
                        )}

                    <button
                        onClick={() => goToPage(requests.links[requests.current_page + 1]?.url || null)}
                        className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                        disabled={requests.current_page === requests.last_page}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => {
                            const lastPageLink = requests.links.find((link) => link.label === String(requests.last_page));
                            goToPage(lastPageLink?.url || null);
                        }}
                        className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                        disabled={requests.current_page === requests.last_page}
                    >
                        Last
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
