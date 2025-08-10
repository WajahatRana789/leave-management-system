import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leave Types',
        href: '/leave-types',
    },
];

interface LeaveType {
    id: number;
    name: string;
    default_days: number;
}

interface LeaveTypesProps {
    leaveTypes: {
        data: LeaveType[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const columns: ColumnDef<LeaveType>[] = [
    { accessorKey: 'name', header: 'Leave Type Name' },
    { accessorKey: 'default_days', header: 'Default Days' },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const leaveType = row.original;

            const handleDelete = () => {
                if (confirm(`Are you sure you want to delete leave type "${leaveType.name}"?`)) {
                    router.delete(route('leave-types.destroy', leaveType.id));
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                        <Link href={route('leave-types.edit', leaveType.id)}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                </div>
            );
        },
    },
];

export default function LeaveTypesPage({ leaveTypes }: LeaveTypesProps) {
    const table = useReactTable({
        data: leaveTypes.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave Types" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Leave Types</h1>
                    <Button asChild>
                        <Link href={route('leave-types.create')}>Create Leave Type</Link>
                    </Button>
                </div>

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

                    <div className="mt-4 flex flex-wrap items-center gap-1">
                        <button
                            onClick={() => goToPage(leaveTypes.current_page > 1 ? leaveTypes.links[1].url : null)}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={leaveTypes.current_page === 1}
                        >
                            First
                        </button>

                        <button
                            onClick={() => goToPage(leaveTypes.current_page > 1 ? leaveTypes.links[leaveTypes.current_page - 1].url : null)}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={leaveTypes.current_page === 1}
                        >
                            Prev
                        </button>

                        {Array.from({ length: leaveTypes.last_page }, (_, i) => i + 1)
                            .filter((page) => page === 1 || page === leaveTypes.last_page || Math.abs(page - leaveTypes.current_page) <= 1)
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
                                        onClick={() => goToPage(leaveTypes.links.find((l) => l.label === String(page))?.url || null)}
                                        className={`rounded border px-3 py-1 text-sm ${
                                            leaveTypes.current_page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ),
                            )}

                        <button
                            onClick={() =>
                                goToPage(leaveTypes.current_page < leaveTypes.last_page ? leaveTypes.links[leaveTypes.current_page + 1].url : null)
                            }
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={leaveTypes.current_page === leaveTypes.last_page}
                        >
                            Next
                        </button>

                        <button
                            onClick={() => {
                                const lastPageLink = leaveTypes.links.find((link) => link.label === String(leaveTypes.last_page));
                                goToPage(lastPageLink?.url || null);
                            }}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={leaveTypes.current_page === leaveTypes.last_page}
                        >
                            Last
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
