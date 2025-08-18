import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDisplay } from '@/lib/date';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Lieu Offs',
        href: '/my-lieu-offs',
    },
];

interface LieuOff {
    id: number;
    work_date: string;
    expiry_date: string;
    status: 'available' | 'used' | 'expired' | 'pending_approval';
    remarks: string;
    granted_by_user: { id: number; name: string };
}

interface MyLieuOffsProps {
    lieuOffs: {
        data: LieuOff[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    leaveTypeId: number;
}

export default function MyLieuOffsPage({ lieuOffs, leaveTypeId }: MyLieuOffsProps) {
    const { auth } = usePage().props as any;
    const [selectedLieuOff, setSelectedLieuOff] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        lieu_off_id: '',
        leave_type_id: leaveTypeId,
        is_lieu_off: true,
        from_date: '',
        to_date: '',
        reason: '',
    });

    const columns: ColumnDef<LieuOff>[] = [
        {
            accessorKey: 'work_date',
            header: 'Work Date',
            cell: ({ row }) => {
                return formatDisplay(row.original.work_date);
            },
        },
        {
            accessorKey: 'expiry_date',
            header: 'Expiry Date',
            cell: ({ row }) => {
                return formatDisplay(row.original.expiry_date);
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const statusColors = {
                    available: 'bg-green-100 text-green-800',
                    used: 'bg-blue-100 text-blue-800',
                    expired: 'bg-gray-100 text-gray-800',
                    pending_approval: 'bg-yellow-100 text-yellow-800',
                };
                return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[status]}`}>{status?.toUpperCase()}</span>;
            },
        },
        {
            accessorKey: 'granted_by_user.name',
            header: 'Granted By',
            cell: ({ row }) => row.original.granted_by_user?.name || '-',
        },
        {
            accessorKey: 'granted_by_user.created_at',
            header: 'Granted At',
            cell: ({ row }) => formatDisplay(row.original.granted_by_user?.created_at),
        },
        {
            accessorKey: 'remarks',
            header: 'Reason',
            cell: ({ row }) => row.original?.remarks || '',
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const status = row.original?.status?.toLowerCase();
                if (status === 'available') {
                    return (
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleOpen(row.original)}>
                                Avail
                            </Button>
                        </div>
                    );
                }
            },
        },
    ];

    const table = useReactTable({
        data: lieuOffs.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    const handleOpen = (lieu) => {
        setSelectedLieuOff(lieu);
        setData({
            lieu_off_id: lieu.id,
            leave_type_id: leaveTypeId,
            is_lieu_off: true,
            from_date: '',
            to_date: '',
            reason: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/leave-requests', {
            onSuccess: () => {
                reset();
                setSelectedLieuOff(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Lieu Offs" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Lieu Offs</h1>
                </div>

                <div className="mt-2 text-sm text-gray-600">Total records: {lieuOffs.total}</div>

                <div className="mt-4">
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className="px-4 py-2 text-left">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border-t">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-4 py-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {lieuOffs.data.length} of {lieuOffs.total} records
                        </div>

                        <div className="flex flex-wrap items-center gap-1">
                            <button
                                onClick={() => goToPage(lieuOffs.current_page > 1 ? lieuOffs.links[1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={lieuOffs.current_page === 1}
                            >
                                First
                            </button>

                            <button
                                onClick={() => goToPage(lieuOffs.current_page > 1 ? lieuOffs.links[lieuOffs.current_page - 1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={lieuOffs.current_page === 1}
                            >
                                Prev
                            </button>

                            {Array.from({ length: lieuOffs.last_page }, (_, i) => i + 1)
                                .filter((page) => page === 1 || page === lieuOffs.last_page || Math.abs(page - lieuOffs.current_page) <= 1)
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
                                            onClick={() => goToPage(lieuOffs.links.find((l) => l.label == String(page))?.url || null)}
                                            className={`rounded border px-3 py-1 text-sm ${
                                                lieuOffs.current_page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}

                            <button
                                onClick={() =>
                                    goToPage(lieuOffs.current_page < lieuOffs.last_page ? lieuOffs.links[lieuOffs.current_page + 1].url : null)
                                }
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={lieuOffs.current_page === lieuOffs.last_page}
                            >
                                Next
                            </button>

                            <button
                                onClick={() => {
                                    const lastPageLink = lieuOffs.links.find((link) => link.label == String(lieuOffs.last_page));
                                    goToPage(lastPageLink?.url || null);
                                }}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={lieuOffs.current_page === lieuOffs.last_page}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Dialog open={!!selectedLieuOff} onOpenChange={(open) => !open && setSelectedLieuOff(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Claim Lieu Off</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Leave Date*</Label>
                            <Input
                                type="date"
                                value={data.from_date}
                                onChange={(e) => {
                                    setData('from_date', e.target.value);
                                    setData('to_date', e.target.value); // force same day
                                }}
                                required
                            />
                            {selectedLieuOff && (
                                <div className="mt-2 mb-3 px-2 text-sm text-gray-500">
                                    <div>Expiry: {formatDisplay(selectedLieuOff?.expiry_date)}</div>
                                </div>
                            )}

                            {errors.from_date && <p className="text-sm text-red-500">{errors.from_date}</p>}
                        </div>
                        <div>
                            <Label>Reason</Label>
                            <Textarea rows={3} value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                            {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setSelectedLieuOff(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Claim'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
