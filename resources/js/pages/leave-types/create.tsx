import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Leave Types', href: '/leave-types' },
    { title: 'Create Leave Type', href: '#' },
];

export default function CreateLeaveType() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        default_days: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leave-types');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Leave Type" />
            <div className="h-full overflow-x-auto rounded-xl p-4 pt-0">
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create New Leave Type</h1>
                </div>
                <div className="pt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Leave Type Name*</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="default_days">Default Days*</Label>
                                    <Input
                                        id="default_days"
                                        type="number"
                                        value={data.default_days}
                                        onChange={(e) => setData('default_days', e.target.value)}
                                        required
                                    />
                                    {errors.default_days && <p className="text-sm text-red-500">{errors.default_days}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Leave Type'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
