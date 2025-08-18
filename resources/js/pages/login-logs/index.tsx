import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Login Logs',
        href: '/login-logs',
    },
];

interface LoginLog {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    event: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

interface LoginLogsProps {
    logs: {
        data: LoginLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const columns: ColumnDef<LoginLog>[] = [
    {
        accessorKey: 'user.name',
        header: 'User',
        cell: ({ row }) => row.original.user?.name || '-',
    },
    {
        accessorKey: 'event',
        header: 'Event',
    },
    {
        accessorKey: 'ip_address',
        header: 'IP Address',
    },
    {
        accessorKey: 'user_agent',
        header: 'User Agent',
        cell: ({ row }) => (
            <span className="line-clamp-1 max-w-[250px]" title={row.original.user_agent || ''}>
                {row.original.user_agent || '-'}
            </span>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Time',
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return format(date, 'EEE dd MMM, yyyy hh:mm a');
        },
    },
];

export default function LoginLogsPage({ logs, filters }: LoginLogsProps) {
    const { user } = usePage().props.auth;
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('login-logs.index'), { search }, { preserveState: true, replace: true });
    };

    const table = useReactTable({
        data: logs.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Login Logs" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Login Logs</h1>
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="rounded border px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Button type="submit" size="sm" variant="outline">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
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

                    {/* Pagination */}
                    <div className="mt-4 flex flex-wrap items-center gap-1">
                        {/* First */}
                        <button
                            onClick={() => goToPage(logs.current_page > 1 ? logs.links[1].url : null)}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={logs.current_page === 1}
                        >
                            First
                        </button>

                        {/* Prev */}
                        <button
                            onClick={() => goToPage(logs.current_page > 1 ? logs.links[logs.current_page - 1].url : null)}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={logs.current_page === 1}
                        >
                            Prev
                        </button>

                        {/* Pages with ellipsis */}
                        {Array.from({ length: logs.last_page }, (_, i) => i + 1)
                            .filter((page) => page === 1 || page === logs.last_page || Math.abs(page - logs.current_page) <= 1)
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
                                        onClick={() => goToPage(logs.links.find((l) => l.label === String(page))?.url || null)}
                                        className={`rounded border px-3 py-1 text-sm ${
                                            logs.current_page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ),
                            )}

                        {/* Next */}
                        <button
                            onClick={() => goToPage(logs.current_page < logs.last_page ? logs.links[logs.current_page + 1].url : null)}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={logs.current_page === logs.last_page}
                        >
                            Next
                        </button>

                        {/* Last */}
                        <button
                            onClick={() => {
                                const lastPageLink = logs.links.find((link) => link.label === String(logs.last_page));
                                goToPage(lastPageLink?.url || null);
                            }}
                            className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                            disabled={logs.current_page === logs.last_page}
                        >
                            Last
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
