import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    leaveTypes: {
        id: number;
        name: string;
        allocated: number;
        used: number;
        remaining: number;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Leave Requests', href: '/leave-requests' },
    { title: 'Apply for Leave', href: '#' },
];

export default function CreateLeaveRequest({ leaveTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        leave_type_id: '',
        from_date: '',
        to_date: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend validation for zero balance
        const selectedLeaveType = leaveTypes.find((type) => String(type.id) === data.leave_type_id);
        if (selectedLeaveType && selectedLeaveType.remaining <= 0) {
            return;
        }

        post('/leave-requests');
    };

    // Get the selected leave type's remaining balance
    const selectedLeaveType = leaveTypes.find((type) => String(type.id) === data.leave_type_id);
    const remainingBalance = selectedLeaveType?.remaining ?? null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Apply for Leave" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Apply for Leave</h1>
                </div>
                <div>
                    <table className="mt-4 mb-4 w-full rounded-lg border p-4">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left text-sm">Leave Type</th>
                                <th className="p-2 text-left text-sm">Allocated</th>
                                <th className="p-2 text-left text-sm">Used</th>
                                <th className="p-2 text-left text-sm">Remaining</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {leaveTypes.map((type) => (
                                <tr key={type.id} className="border-b">
                                    <td className="p-2 text-sm font-medium">{type.name}</td>
                                    <td className="p-2 text-sm">{type.allocated}</td>
                                    <td className="p-2 text-sm">{type.used}</td>
                                    <td className={`p-2 text-sm ${type.remaining <= 0 ? 'font-semibold text-red-500' : ''}`}>{type.remaining}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <Label htmlFor="leave_type_id">Leave Type*</Label>
                                    <Select value={data.leave_type_id} onValueChange={(value) => setData('leave_type_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select leave type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {leaveTypes.map((type) => (
                                                <SelectItem
                                                    key={type.id}
                                                    value={String(type.id)}
                                                    disabled={type.remaining <= 0}
                                                    className={type.remaining <= 0 ? 'opacity-50' : ''}
                                                >
                                                    {type.name} {type.remaining <= 0 && '(No balance)'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.leave_type_id && <p className="text-sm text-red-500">{errors.leave_type_id}</p>}
                                    {remainingBalance !== null && (
                                        <p className={`mt-1 text-xs ${remainingBalance <= 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            Available balance: {remainingBalance} day{remainingBalance !== 1 ? 's' : ''}
                                            {remainingBalance <= 0 && ' - You cannot apply for this leave type'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="from_date">From Date*</Label>
                                    <Input
                                        id="from_date"
                                        type="date"
                                        value={data.from_date}
                                        onChange={(e) => setData('from_date', e.target.value)}
                                        required
                                    />
                                    {errors.from_date && <p className="text-sm text-red-500">{errors.from_date}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="to_date">To Date*</Label>
                                    <Input
                                        id="to_date"
                                        type="date"
                                        value={data.to_date}
                                        onChange={(e) => setData('to_date', e.target.value)}
                                        required
                                    />
                                    {errors.to_date && <p className="text-sm text-red-500">{errors.to_date}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="reason">Reason (optional)</Label>
                                <Textarea id="reason" rows={3} value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                                {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing || (selectedLeaveType?.remaining ?? 0) <= 0}>
                                    {processing ? 'Submitting...' : 'Apply for Leave'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
