import { Skeleton } from "@/components/ui/skeleton";

export default function DetailSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 flex gap-5">
                    <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-4 w-56 mt-1" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 flex flex-col gap-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>
        </div>
    );
}