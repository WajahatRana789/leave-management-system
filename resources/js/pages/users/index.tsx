import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
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
                    {/* <Button asChild>
                        <Link href={route('users.create')}>Create User</Link>
                    </Button> */}
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

                    <div className="mt-4 flex flex-wrap gap-1">
                        {users.links.map((link, i) => (
                            <button
                                key={i}
                                className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                onClick={() => goToPage(link.url)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
