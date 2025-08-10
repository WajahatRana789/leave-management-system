import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lieu Leaves',
        href: '/lieu-leaves',
    },
];

interface LieuLeave {
    id: number;
    user: { id: number; name: string };
    granted_by_user: { id: number; name: string };
    work_date: string;
    expiry_date: string;
    status: 'available' | 'used' | 'expired';
}

interface LieuLeavesProps {
    lieuLeaves: {
        data: LieuLeave[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function LieuLeavesPage({ lieuLeaves }: LieuLeavesProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { auth } = usePage().props as any;

    const columns: ColumnDef<LieuLeave>[] = [
        { accessorKey: 'user.name', header: 'Employee', cell: ({ row }) => row.original.user?.name || '-' },
        { accessorKey: 'granted_by_user.name', header: 'Granted By', cell: ({ row }) => row.original.granted_by_user?.name || '-' },
        { accessorKey: 'work_date', header: 'Work Date' },
        { accessorKey: 'expiry_date', header: 'Expiry Date' },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                const statusColors = {
                    available: 'bg-green-100 text-green-800',
                    used: 'bg-blue-100 text-blue-800',
                    expired: 'bg-gray-100 text-gray-800',
                };
                return (
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const lieuLeave = row.original;
                const canEdit = ['manager', 'admin', 'super_admin'].includes(auth.user.role);
                const canDelete = ['manager', 'admin', 'super_admin'].includes(auth.user.role) && lieuLeave.status === 'available';

                return (
                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <Button size="sm" variant="outline" asChild>
                                <Link href={route('lieu-leaves.edit', lieuLeave.id)}>
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    setDeleteId(lieuLeave.id);
                                    setIsDeleteDialogOpen(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: lieuLeaves.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('lieu-leaves.destroy', deleteId), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setDeleteId(null);
            },
            onError: () => {
                setIsDeleteDialogOpen(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lieu Leaves" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Lieu Leaves</h1>
                    {['admin', 'super_admin'].includes(auth.user.role) && (
                        <Button asChild>
                            <Link href={route('lieu-leaves.create')}>Grant Lieu Leave</Link>
                        </Button>
                    )}
                </div>

                <div className="mt-2 text-sm text-gray-600">Total records: {lieuLeaves.total}</div>

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
                            Showing {lieuLeaves.data.length} of {lieuLeaves.total} records
                        </div>

                        <div className="flex flex-wrap items-center gap-1">
                            <button
                                onClick={() => goToPage(lieuLeaves.current_page > 1 ? lieuLeaves.links[1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={lieuLeaves.current_page === 1}
                            >
                                First
                            </button>

                            <button
                                onClick={() => goToPage(lieuLeaves.current_page > 1 ? lieuLeaves.links[lieuLeaves.current_page - 1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={lieuLeaves.current_page === 1}
                            >
                                Prev
                            </button>

                            {Array.from({ length: lieuLeaves.last_page }, (_, i) => i + 1)
                                .filter((page) => page === 1 || page === lieuLeaves.last_page || Math.abs(page - lieuLeaves.current_page) <= 1)
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
                                            onClick={() => goToPage(lieuLeaves.links.find((l) => l.label == String(page))?.url || null)}
                                            className={`rounded border px-3 py-1 text-sm ${
                                                lieuLeaves.current_page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}

                            <button
                                onClick={() =>
                                    goToPage(
                                        lieuLeaves.current_page < lieuLeaves.last_page ? lieuLeaves.links[lieuLeaves.current_page + 1].url : null,
                                    )
                                }
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={lieuLeaves.current_page === lieuLeaves.last_page}
                            >
                                Next
                            </button>

                            <button
                                onClick={() => {
                                    const lastPageLink = lieuLeaves.links.find((link) => link.label == String(lieuLeaves.last_page));
                                    goToPage(lastPageLink?.url || null);
                                }}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={lieuLeaves.current_page === lieuLeaves.last_page}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this lieu leave?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the lieu leave record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
