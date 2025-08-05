import { LeaveRequest } from '@/types';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';

type Props = {
    leaves: LeaveRequest[];
};

export default function EmployeeLeaveCalendar({ leaves }: Props) {
    const events = leaves.map((leave) => ({
        id: String(leave.id),
        title: `${leave.leave_type.name} (${leave.status})`,
        start: leave.from_date,
        end: leave.to_date,
        color:
            leave.status === 'approved'
                ? '#22c55e' // green
                : leave.status === 'pending'
                  ? '#facc15' // yellow
                  : '#ef4444', // red
    }));

    return (
        <div className="mt-6 rounded-xl border bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold">My Leave Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                events={events}
                eventDisplay="block"
                headerToolbar={{
                    start: 'prev,next today',
                    center: 'title',
                    end: '',
                }}
            />
        </div>
    );
}
