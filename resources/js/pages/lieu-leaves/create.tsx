import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grant Lieu Leave',
        href: '/grant-lieu-leave',
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
    errors?: {
        [key: string]: string;
    };
}

export default function GrantLieuLeavePage({ users, errors }: UsersProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [form, setForm] = useState({
        work_date: '',
        expiry_date: '',
        expiry_option: '60',
        reason: '',
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const table = useReactTable({
        data: users.data,
        columns: [
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
                    return (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setSelectedUser(user);
                                setForm({ work_date: '', expiry_date: '', expiry_option: '60', reason: '' });
                                setFormErrors({});
                            }}
                        >
                            Grant
                        </Button>
                    );
                },
            },
        ] as ColumnDef<User>[],
        getCoreRowModel: getCoreRowModel(),
    });

    const goToPage = (url: string | null) => {
        if (url) router.visit(url);
    };

    const handleSubmit = () => {
        if (!selectedUser) return;

        router.post(
            route('lieu-leaves.store'),
            {
                user_id: selectedUser.id,
                work_date: form.work_date,
                expiry_date: form.expiry_option === '60' ? '' : form.expiry_date,
                expiry_option: form.expiry_option,
                reason: form.reason,
            },
            {
                onSuccess: () => {
                    setSelectedUser(null);
                    setFormErrors({});
                },
                onError: (errors) => {
                    setFormErrors(errors);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grant Lieu Leave" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Grant Lieu Leave</h1>
                </div>

                <div className="mt-2 text-sm text-gray-600">Total records: {users.total}</div>

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
                            <button
                                onClick={() => goToPage(users.current_page > 1 ? users.links[1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={users.current_page === 1}
                            >
                                First
                            </button>
                            <button
                                onClick={() => goToPage(users.current_page > 1 ? users.links[users.current_page - 1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={users.current_page === 1}
                            >
                                Prev
                            </button>
                            {Array.from({ length: users.last_page }, (_, i) => i + 1)
                                .filter((page) => page === 1 || page === users.last_page || Math.abs(page - users.current_page) <= 1)
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
                                            onClick={() => goToPage(users.links.find((l) => l.label == String(page))?.url || null)}
                                            className={`rounded border px-3 py-1 text-sm ${
                                                users.current_page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}
                            <button
                                onClick={() => goToPage(users.current_page < users.last_page ? users.links[users.current_page + 1].url : null)}
                                className="rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                                disabled={users.current_page === users.last_page}
                            >
                                Next
                            </button>
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

            {/* Dialog Component */}
            <Dialog
                open={!!selectedUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedUser(null);
                        setFormErrors({});
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grant Lieu Leave to {selectedUser?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Work Date</label>
                            <input
                                type="date"
                                value={form.work_date}
                                onChange={(e) => setForm({ ...form, work_date: e.target.value })}
                                className={`w-full rounded border px-2 py-1 ${formErrors.work_date ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.work_date && <p className="mt-1 text-sm text-red-600">{formErrors.work_date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Expiry</label>
                            <select
                                value={form.expiry_option}
                                onChange={(e) => setForm({ ...form, expiry_option: e.target.value })}
                                className={`w-full rounded border px-2 py-1 ${formErrors.expiry_date ? 'border-red-500' : ''}`}
                            >
                                <option value="60">After 60 days (default)</option>
                                <option value="custom">Custom date</option>
                            </select>
                            {form.expiry_option === 'custom' && (
                                <>
                                    <input
                                        type="date"
                                        value={form.expiry_date}
                                        onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                                        className={`mt-2 w-full rounded border px-2 py-1 ${formErrors.expiry_date ? 'border-red-500' : ''}`}
                                        required={form.expiry_option === 'custom'}
                                        min={form.work_date}
                                    />
                                    {formErrors.expiry_date && <p className="mt-1 text-sm text-red-600">{formErrors.expiry_date}</p>}
                                </>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Reason</label>
                            <textarea
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                className={`w-full rounded border px-2 py-1 ${formErrors.reason ? 'border-red-500' : ''}`}
                                rows={3}
                                required
                            />
                            {formErrors.reason && <p className="mt-1 text-sm text-red-600">{formErrors.reason}</p>}
                        </div>
                        {/* Display non-field specific errors */}
                        {formErrors.user_id && <p className="mt-1 text-sm text-red-600">{formErrors.user_id}</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedUser(null);
                                setFormErrors({});
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Grant</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
