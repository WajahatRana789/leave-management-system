import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Shift, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    shift: Shift;
    managers: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Shifts', href: '/shifts' },
    { title: 'Edit Shift', href: 'javascript:void(0)' },
];

export default function EditShift({ shift, managers }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: shift.name,
        manager_id: shift.manager_id ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/shifts/${shift.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Shift" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Shift</h1>
                </div>
                <div className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Shift Name*</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="manager_id">Shift Incharge</Label>
                                <Select
                                    value={data.manager_id ? String(data.manager_id) : undefined}
                                    onValueChange={(val) => setData('manager_id', val)}
                                >
                                    <SelectTrigger className="w-full" id="manager">
                                        <SelectValue placeholder="-- Choose a manager --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map((manager) => (
                                            <SelectItem key={manager.id} value={String(manager.id)}>
                                                {manager.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {errors.manager_id && <p className="text-sm text-red-500">{errors.manager_id}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Shift'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
