import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shifts',
        href: '/shifts',
    },
];

interface Manager {
    id: number;
    name: string;
    email: string;
}

interface Shift {
    id: number;
    name: string;
    managers: Manager[];
}

interface ShiftsProps {
    shifts: {
        data: Shift[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const columns: ColumnDef<Shift>[] = [
    { accessorKey: 'name', header: 'Shift Name' },
    {
        accessorKey: 'manager.name',
        header: 'Shift Incharge',
        cell: ({ row }) => row.original.manager?.name || '-',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const shift = row.original;

            const handleDelete = () => {
                if (confirm(`Are you sure you want to delete shift "${shift.name}"?`)) {
                    router.delete(route('shifts.destroy', shift.id));
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                        <Link href={route('shifts.edit', shift.id)}>
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

export default function ShiftsPage({ shifts }: ShiftsProps) {
    const table = useReactTable({
        data: shifts.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shifts" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Shifts</h1>
                    <Button asChild>
                        <Link href={route('shifts.create')}>Create Shift</Link>
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
                        {/* First */}
                        <button
                            onClick={() => goToPage(shifts.current_page > 1 ? shifts.links[1].url : null)}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={shifts.current_page === 1}
                        >
                            First
                        </button>

                        {/* Prev */}
                        <button
                            onClick={() => goToPage(shifts.current_page > 1 ? shifts.links[shifts.current_page - 1].url : null)}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={shifts.current_page === 1}
                        >
                            Prev
                        </button>

                        {/* Pages with ellipsis */}
                        {Array.from({ length: shifts.last_page }, (_, i) => i + 1)
                            .filter((page) => page === 1 || page === shifts.last_page || Math.abs(page - shifts.current_page) <= 1)
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
                                        onClick={() => goToPage(shifts.links.find((l) => l.label === String(page))?.url || null)}
                                        className={`rounded border px-3 py-1 text-sm ${
                                            shifts.current_page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ),
                            )}

                        {/* Next */}
                        <button
                            onClick={() => goToPage(shifts.current_page < shifts.last_page ? shifts.links[shifts.current_page + 1].url : null)}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={shifts.current_page === shifts.last_page}
                        >
                            Next
                        </button>

                        {/* Last */}
                        <button
                            onClick={() => {
                                const lastPageLink = shifts.links.find((link) => link.label === String(shifts.last_page));
                                goToPage(lastPageLink?.url || null);
                            }}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={shifts.current_page === shifts.last_page}
                        >
                            Last
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
