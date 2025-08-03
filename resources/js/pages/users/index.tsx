import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    shift?: {
        name: string;
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

const columns: ColumnDef<User>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
    {
        accessorKey: 'shift.name',
        header: 'Shift',
        cell: ({ row }) => row.original.shift?.name || '-',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const user = row.original;

            const handleDelete = () => {
                if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
                    router.delete(route('users.destroy', user.id));
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                        <Link href={route('users.edit', user.id)}>Edit</Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            );
        },
    },
];

export default function UsersPage({ users }: UsersProps) {
    const table = useReactTable({
        data: users.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Button asChild>
                        <Link href={route('users.create')}>Create User</Link>
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
        </AppLayout>
    );
}
