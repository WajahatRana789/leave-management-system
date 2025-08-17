import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    shift_incharges: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Shifts', href: '/shifts' },
    { title: 'Create Shift', href: 'javascript:void(0)' },
];

export default function CreateShift({ shift_incharges }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        shift_incharge_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/shifts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Shift" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create New Shift</h1>
                </div>
                <div className="pt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Shift Name*</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="shift_incharge_id">Shift Incharge*</Label>
                                    <Select value={data.shift_incharge_id} onValueChange={(val) => setData('shift_incharge_id', val)}>
                                        <SelectTrigger id="shift_incharge_id" className="w-full">
                                            <SelectValue placeholder="-- Choose shift_incharge --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {shift_incharges.map((shift_incharge) => (
                                                <SelectItem key={shift_incharge.id} value={String(shift_incharge.id)}>
                                                    {shift_incharge.name} ({shift_incharge.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.shift_incharge_id && <p className="mt-1 text-sm text-red-500">{errors.shift_incharge_id}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Shift'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
