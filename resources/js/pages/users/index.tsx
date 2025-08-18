import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    last_login_at: string;
    shift?: {
        name: string;
    };
    designation?: {
        title: string;
    };
}

interface UsersProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function UsersPage({ users, filters }: UsersProps) {
    const { user } = usePage().props.auth;
    const [search, setSearch] = useState(filters?.search || '');

    const columns: ColumnDef<User>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phone', header: 'Phone' },
        { accessorKey: 'whatsapp', header: 'Whatsapp' },
        {
            accessorKey: 'designation.title',
            header: 'Designation',
            cell: ({ row }) => row.original.designation?.title || '-',
        },
        { accessorKey: 'role', header: 'Role' },
        {
            accessorKey: 'shift.name',
            header: 'Shift',
            cell: ({ row }) => row.original.shift?.name || '-',
        },
        {
            accessorKey: 'last_login_at',
            header: 'Last Login At',
            cell: ({ row }) => {
                const date = row.original.last_login_at;
                if (date) {
                    const d = typeof date === 'string' ? new Date(date) : date;
                    return format(d, 'EEE dd MMM, yyyy hh:mm a');
                    // Example: Mon 19 Aug, 2025 04:32 PM
                }
                return '-';
            },
        },
    ];

    if (user.role === 'super_admin') {
        columns.push({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const user = row.original;

                const handleDelete = () => {
                    if (user.role === 'super_admin') {
                        alert('Cannot delete super admin user');
                        return;
                    }

                    if (confirm(`Are you sure you want to delete employee "${user.name}"?`)) {
                        router.delete(route('users.destroy', user.id));
                    }
                };

                return (
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                            <Link href={route('users.edit', user.id)}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={user.role === 'super_admin'}>
                            <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                );
            },
        });
    }

    const table = useReactTable({
        data: users.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('users.index'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Employees</h1>
                    {user.role === 'super_admin' && (
                        <>
                            <Button asChild>
                                <Link href={route('users.create')}>Create Employee</Link>
                            </Button>
                        </>
                    )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Total records: {users.total}</div>
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

                    <div className="mt-4 flex flex-wrap items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {users.data.length} of {users.total} records
                        </div>

                        <div className="flex flex-wrap items-center gap-1">
                            {/* First */}
                            <button
                                onClick={() => goToPage(users.current_page > 1 ? users.links[1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={users.current_page === 1}
                            >
                                First
                            </button>

                            {/* Prev */}
                            <button
                                onClick={() => goToPage(users.current_page > 1 ? users.links[users.current_page - 1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={users.current_page === 1}
                            >
                                Prev
                            </button>

                            {/* Numbered pages with ellipsis */}
                            {Array.from({ length: users.last_page }, (_, i) => i + 1)
                                .filter((page) => page === 1 || page === users.last_page || Math.abs(page - users.current_page) <= 1)
                                .reduce<number[]>((acc, page, idx, arr) => {
                                    if (idx > 0 && page - arr[idx - 1] > 1) acc.push(-1); // use -1 as marker for ellipsis
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
                                            onClick={() => goToPage(users.links.find((l) => l.label == String(page))?.url || null)}
                                            className={`rounded border px-3 py-1 text-sm ${
                                                users.current_page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}

                            {/* Next */}
                            <button
                                onClick={() => goToPage(users.current_page < users.last_page ? users.links[users.current_page + 1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={users.current_page === users.last_page}
                            >
                                Next
                            </button>

                            {/* Last */}
                            <button
                                onClick={() => {
                                    const lastPageLink = users.links.find((link) => link.label == String(users.last_page));
                                    goToPage(lastPageLink?.url || null);
                                }}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={users.current_page === users.last_page}
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
