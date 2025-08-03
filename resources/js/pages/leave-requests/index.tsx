import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface LeaveRequest {
    id: number;
    user: { name: string };
    leave_type: { name: string };
    from_date: string;
    to_date: string;
    total_days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by?: { name: string };
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
    canReview: boolean;
    authUser: {
        id: number;
        role: string;
    };
}

export default function LeaveRequestIndex({ requests, canReview, authUser }: Props) {
    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    return (
        <AppLayout>
            <Head title="Leave Requests" />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Leave Requests</h1>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2">Employee</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">From</th>
                                <th className="px-4 py-2">To</th>
                                <th className="px-4 py-2">Days</th>
                                <th className="px-4 py-2">Status</th>
                                {(canReview ||
                                    requests.data.some(
                                        (req) => req.status === 'pending' && req.user.id === authUser.id && authUser.role === 'employee',
                                    )) && <th className="px-4 py-2">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.data.map((req) => (
                                <tr key={req.id}>
                                    <td className="px-4 py-2">{req.user.name}</td>
                                    <td className="px-4 py-2">{req.leave_type.name}</td>
                                    <td className="px-4 py-2">{req.from_date}</td>
                                    <td className="px-4 py-2">{req.to_date}</td>
                                    <td className="px-4 py-2">{req.total_days}</td>
                                    <td className="px-4 py-2 capitalize">{req.status}</td>
                                    <td className="space-x-2 px-4 py-2">
                                        {canReview && (
                                            <>
                                                <Button size="sm" variant="outline">
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="destructive">
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        {req.status === 'pending' && req.user.id === authUser.id && authUser.role === 'employee' && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this leave request?')) {
                                                        router.delete(`/leave-requests/${req.id}`);
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
