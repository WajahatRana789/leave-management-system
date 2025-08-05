import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { LeaveRequest } from '@/types';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { useState } from 'react';

type Props = {
    leaves: LeaveRequest[];
    teamLeaves?: LeaveRequest[];
};

export default function EmployeeLeaveCalendar({ leaves, teamLeaves = [] }: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [teamMembersOnDate, setTeamMembersOnDate] = useState<LeaveRequest[]>([]);

    // Personal leave events
    const personalEvents = leaves.map((leave) => ({
        id: `personal-${leave.id}`,
        title: `${leave.leave_type.name} (You)`,
        start: leave.from_date,
        end: leave.to_date,
        color:
            leave.status === 'approved'
                ? '#22c55e' // green
                : leave.status === 'pending'
                  ? '#facc15' // yellow
                  : '#ef4444', // red
        extendedProps: {
            type: 'personal',
            status: leave.status,
            reason: leave.reason,
            reviewedBy: leave.reviewed_by?.name || null,
        },
    }));

    // Group team leaves by date to show counts
    const teamLeavesByDate: Record<string, LeaveRequest[]> = {};

    teamLeaves.forEach((leave) => {
        const start = new Date(leave.from_date);
        const end = new Date(leave.to_date);
        const current = new Date(start);

        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            if (!teamLeavesByDate[dateStr]) {
                teamLeavesByDate[dateStr] = [];
            }
            teamLeavesByDate[dateStr].push(leave);
            current.setDate(current.getDate() + 1);
        }
    });

    // Team leave count events (shows count for each day)
    const teamCountEvents = Object.entries(teamLeavesByDate).map(([date, leaves]) => ({
        id: `team-count-${date}`,
        title: `${leaves.length} team member${leaves.length > 1 ? 's' : ''}`,
        start: date,
        display: 'background',
        color: 'transparent',
        extendedProps: {
            type: 'team-count',
            count: leaves.length,
            leaves,
        },
    }));

    // Combine events
    const events = [...personalEvents, ...teamCountEvents];

    // Handle date click to show team members on leave
    const handleDateClick = (arg: any) => {
        const dateStr = arg.dateStr;
        if (teamLeavesByDate[dateStr]) {
            setSelectedDate(new Date(dateStr));
            setTeamMembersOnDate(teamLeavesByDate[dateStr]);
            setOpenDialog(true);
        }
    };

    // Custom event content
    const renderEventContent = (eventInfo: any) => {
        const isPersonal = eventInfo.event.extendedProps.type === 'personal';
        const isTeamCount = eventInfo.event.extendedProps.type === 'team-count';

        if (isTeamCount) {
            return (
                <div className="w-full text-center">
                    <span className="text-xs font-medium">{eventInfo.event.title}</span>
                </div>
            );
        }

        return (
            <Tooltip
                content={
                    <div className="p-2">
                        <div className="font-semibold">{eventInfo.event.title}</div>
                        <div>Status: {eventInfo.event.extendedProps.status}</div>
                        {eventInfo.event.extendedProps.reason && <div>Reason: {eventInfo.event.extendedProps.reason}</div>}
                        {eventInfo.event.extendedProps.reviewedBy && <div>Reviewed by: {eventInfo.event.extendedProps.reviewedBy}</div>}
                    </div>
                }
            >
                <div className="flex items-center p-1">
                    {isPersonal ? <span className="mr-1">✓</span> : <span className="mr-1">👥</span>}
                    <span className="truncate">{isPersonal ? 'You' : eventInfo.event.title.split(' - ')[0]}</span>
                </div>
            </Tooltip>
        );
    };

    return (
        <div className="mt-6 rounded-xl border bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold">Leave Calendar</h2>
            <div className="mb-4 flex flex-wrap gap-2">
                <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Your Approved</span>
                </div>
                <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Your Pending</span>
                </div>
                <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Team Members</span>
                </div>
            </div>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                events={events}
                eventContent={renderEventContent}
                eventDisplay="block"
                dateClick={handleDateClick}
                headerToolbar={{
                    start: 'prev,next today',
                    center: 'title',
                    end: '',
                }}
            />

            {/* Team Members on Leave Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Team Members on Leave - {selectedDate?.toLocaleDateString()}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Leave Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Dates</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamMembersOnDate.map((leave) => (
                                    <TableRow key={leave.id}>
                                        <TableCell>{leave.user.name}</TableCell>
                                        <TableCell>{leave.leave_type.name}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${
                                                    leave.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : leave.status === 'rejected'
                                                          ? 'bg-red-100 text-red-800'
                                                          : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {leave.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
