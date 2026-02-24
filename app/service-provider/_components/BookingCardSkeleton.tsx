import { Skeleton } from "@/components/ui/skeleton";

export default function BookingCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gray-100" />
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="h-px bg-gray-100" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-40" />
            </div>
        </div>
    );
}