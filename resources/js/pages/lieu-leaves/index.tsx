import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

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

const columns: ColumnDef<LieuLeave>[] = [
    { accessorKey: 'user.name', header: 'Employee', cell: ({ row }) => row.original.user?.name || '-' },
    { accessorKey: 'granted_by_user.name', header: 'Granted By', cell: ({ row }) => row.original.granted_by_user?.name || '-' },
    { accessorKey: 'work_date', header: 'Work Date' },
    { accessorKey: 'expiry_date', header: 'Expiry Date' },
    { accessorKey: 'status', header: 'Status' },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const { auth } = usePage().props as any;
            const lieuLeave = row.original;

            const handleDelete = () => {
                if (!confirm(`Delete lieu leave for "${lieuLeave.user?.name}"?`)) return;
                router.delete(route('lieu-leaves.destroy', lieuLeave.id));
            };

            // Only admin & super_admin can delete
            if (!['admin', 'super_admin'].includes(auth.user.role)) return null;

            return (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            );
        },
    },
];

export default function LieuLeavesPage({ lieuLeaves }: LieuLeavesProps) {
    const table = useReactTable({
        data: lieuLeaves.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lieu Leaves" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Lieu Leaves</h1>
                    <Button asChild>
                        <Link href={route('lieu-leaves.create')}>Grant Lieu Leave</Link>
                    </Button>
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
        </AppLayout>
    );
}
