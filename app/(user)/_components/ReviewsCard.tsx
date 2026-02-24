import { Star } from "lucide-react";

interface ReviewsCardProps {
    ratingCount?: number;
}

export default function ReviewsCard({ ratingCount }: ReviewsCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Reviews</h2>
                <span className="text-xs text-gray-400">
                    {ratingCount ? `${ratingCount} total` : "No reviews yet"}
                </span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-1">
                    <Star className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">Reviews coming soon</p>
                <p className="text-xs text-gray-400">Be the first to book and review this provider</p>
            </div>
        </div>
    );
}