import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface LoginLog {
    id: number;
    user: { id: number; name: string; email: string };
    event: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

interface Employee {
    id: number;
    name: string;
    email: string;
}

interface EmployeeLogsProps {
    logs: {
        data: LoginLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    employees: Employee[];
    selectedUserId?: number;
    filters: {
        event?: string;
        from_date?: string;
        to_date?: string;
        search?: string;
    };
}

const columns: ColumnDef<LoginLog>[] = [
    { accessorKey: 'user.name', header: 'Employee' },
    { accessorKey: 'event', header: 'Event' },
    { accessorKey: 'ip_address', header: 'IP Address' },
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
        cell: ({ row }) => format(new Date(row.original.created_at), 'EEE dd MMM, yyyy hh:mm a'),
    },
];

export default function EmployeeLogsPage({ logs, employees, selectedUserId, filters }: EmployeeLogsProps) {
    const { user } = usePage().props.auth;
    const [search, setSearch] = useState(filters?.search || '');
    const [event, setEvent] = useState(filters?.event || '');
    const [fromDate, setFromDate] = useState(filters?.from_date || '');
    const [toDate, setToDate] = useState(filters?.to_date || '');
    const [selectedEmployee, setSelectedEmployee] = useState<number | ''>(selectedUserId || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('employee-logs.index', selectedEmployee || user.id),
            { search, event, from_date: fromDate, to_date: toDate },
            { preserveState: true, replace: true },
        );
    };

    const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = e.target.value ? parseInt(e.target.value) : '';
        setSelectedEmployee(userId);
        router.get(
            route('employee-logs.index', userId || user.id),
            { search, event, from_date: fromDate, to_date: toDate },
            { preserveState: true, replace: true },
        );
    };

    const table = useReactTable({ data: logs.data, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <AppLayout breadcrumbs={[{ title: 'Employee Logs', href: '#' }]}>
            <Head title="Employee Logs" />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Employee Activity Logs</h1>

                {/* Filters */}
                <form onSubmit={handleFilter} className="mb-4 flex flex-wrap items-center gap-2">
                    <select value={selectedEmployee} onChange={handleEmployeeChange} className="rounded border px-3 py-1 text-sm">
                        <option value="">All Employees</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name} ({employee.email})
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search IP / Agent"
                        className="rounded border px-3 py-1 text-sm"
                    />
                    <select value={event} onChange={(e) => setEvent(e.target.value)} className="rounded border px-3 py-1 text-sm">
                        <option value="">All Events</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="failed_login">Failed Login</option>
                    </select>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded border px-3 py-1 text-sm" />
                    <span>-</span>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded border px-3 py-1 text-sm" />
                    <Button type="submit" size="sm" variant="outline">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((h) => (
                                        <th key={h.id} className="px-4 py-2 text-left">
                                            {flexRender(h.column.columnDef.header, h.getContext())}
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
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {logs.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-gray-200 font-semibold' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
