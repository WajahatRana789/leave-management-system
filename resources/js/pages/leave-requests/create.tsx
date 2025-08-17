import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDisplay } from '@/lib/date';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface LeaveType {
    id: number;
    name: string;
    allocated: number;
    used: number;
    remaining: number;
    key: string;
}

interface LieuOff {
    id: number;
    work_date: string;
    expiry_date: string;
}

interface Props {
    leaveTypes: LeaveType[];
    availableLieuOffCount: number;
    availableLieuOffs: LieuOff[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Leave Requests', href: '/leave-requests' },
    { title: 'Apply for Leave', href: '#' },
];

export default function CreateLeaveRequest({ leaveTypes, availableLieuOffs, availableLieuOffCount }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        leave_type_id: '',
        lieu_off_id: '',
        is_lieu_off: false,
        from_date: '',
        to_date: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedLeaveType = leaveTypes.find((type) => String(type.id) === data.leave_type_id);

        if (selectedLeaveType) {
            if (selectedLeaveType.key === 'lieu_leave' && availableLieuOffCount <= 0) return;
            if (selectedLeaveType.key !== 'lieu_leave' && selectedLeaveType.remaining <= 0) return;
        }

        post('/leave-requests');
    };

    const selectedLeaveType = leaveTypes.find((type) => String(type.id) === data.leave_type_id);
    const remainingBalance = selectedLeaveType?.key === 'lieu_leave' ? availableLieuOffCount : (selectedLeaveType?.remaining ?? null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Apply for Leave" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Apply for Leave</h1>
                </div>

                <div className="pt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Leave Type */}
                            <div>
                                <Label htmlFor="leave_type_id">Leave Type*</Label>
                                <Select
                                    value={data.leave_type_id}
                                    onValueChange={(value) => {
                                        setData('leave_type_id', value);
                                        setData('lieu_off_id', '');
                                        setData('is_lieu_off', false);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select leave type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leaveTypes.map((type) => {
                                            const isLieu = type.key === 'lieu_leave';
                                            const isDisabled = isLieu ? availableLieuOffCount <= 0 : type.remaining <= 0;

                                            return (
                                                <SelectItem
                                                    key={type.id}
                                                    value={String(type.id)}
                                                    disabled={isDisabled}
                                                    className={isDisabled ? 'opacity-50' : ''}
                                                >
                                                    {type.name} ({isLieu ? availableLieuOffCount : type.remaining})
                                                </SelectItem>
                                            );
                                        })}
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
                                {/* Lieu Off Date Selection */}
                                {selectedLeaveType?.key === 'lieu_leave' && availableLieuOffs.length > 0 && (
                                    <div>
                                        <div className="mb-3">
                                            <Label htmlFor="lieu_off_id">Select Lieu Date*</Label>
                                            <Select
                                                value={data.lieu_off_id}
                                                onValueChange={(value) => {
                                                    setData('lieu_off_id', value);
                                                    setData('is_lieu_off', true);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select available lieu date" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableLieuOffs.map((lieu) => (
                                                        <SelectItem key={lieu.id} value={String(lieu.id)}>
                                                            {formatDisplay(lieu.work_date)} (expires {formatDisplay(lieu.expiry_date)})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.lieu_off_id && <p className="text-sm text-red-500">{errors.lieu_off_id}</p>}
                                        </div>

                                        {/* Lieu Leave Date */}
                                        <div>
                                            <Label htmlFor="lieu_leave_date">Leave Date*</Label>
                                            <DatePicker
                                                value={data.from_date}
                                                onChange={(val) => {
                                                    setData('from_date', val);
                                                    setData('to_date', val);
                                                }}
                                                required
                                            />
                                            {errors.from_date && <p className="text-sm text-red-500">{errors.from_date}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedLeaveType?.key !== 'lieu_leave' && (
                                <>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {/* From Date */}
                                        <div>
                                            <Label htmlFor="from_date">From Date*</Label>
                                            <DatePicker
                                                value={data.from_date}
                                                onChange={(val) => {
                                                    setData('from_date', val);
                                                }}
                                                required
                                            />
                                            {errors.from_date && <p className="text-sm text-red-500">{errors.from_date}</p>}
                                        </div>

                                        {/* To Date */}
                                        <div>
                                            <Label htmlFor="to_date">To Date*</Label>
                                            <DatePicker value={data.to_date} onChange={(val) => setData('to_date', val)} required />
                                            {errors.to_date && <p className="text-sm text-red-500">{errors.to_date}</p>}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Reason */}
                            <div>
                                <Label htmlFor="reason">Reason (optional)</Label>
                                <Textarea id="reason" rows={3} value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                                {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (selectedLeaveType?.key === 'lieu_leave'
                                            ? availableLieuOffCount <= 0 || !data.lieu_off_id
                                            : (selectedLeaveType?.remaining ?? 0) <= 0)
                                    }
                                >
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
