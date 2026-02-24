"use client";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate, formatTime, ProviderBookingCardData } from "./ProviderBookingCard";

interface ActionDialogProps {
    open: boolean;
    action: "accepted" | "rejected" | "completed" | null;
    booking: ProviderBookingCardData | null;
    onConfirm: () => void;
    onClose: () => void;
    loading: boolean;
}

const config = {
    accepted:  { title: "Accept Booking",    desc: "Are you sure you want to accept this booking? The customer will be notified.",  actionLabel: "Accept",   actionClass: "bg-green-500 hover:bg-green-600 text-white" },
    rejected:  { title: "Reject Booking",    desc: "Are you sure you want to reject this booking? This cannot be undone.",          actionLabel: "Reject",   actionClass: "bg-red-500 hover:bg-red-600 text-white"     },
    completed: { title: "Mark as Completed", desc: "Confirm that the service has been completed successfully.",                     actionLabel: "Complete", actionClass: "bg-blue-500 hover:bg-blue-600 text-white"   },
};

export default function ActionDialog({ open, action, booking, onConfirm, onClose, loading }: ActionDialogProps) {
    if (!action || !booking) return null;

    const { title, desc, actionLabel, actionClass } = config[action];

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {desc}<br /><br />
                        Customer: <strong>{booking.user_id?.fullname}</strong><br />
                        Date: <strong>{formatDate(booking.scheduled_at)}</strong> at <strong>{formatTime(booking.scheduled_at)}</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={loading} className={actionClass}>
                        {loading ? "Processing..." : actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}