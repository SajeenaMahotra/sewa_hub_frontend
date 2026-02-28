"use client";

import { Star } from "lucide-react";

interface ReviewsCardProps {
    rating: number;
    ratingCount?: number;
}

// Simulate a plausible star distribution based on average rating + count
function getStarDistribution(avg: number, total: number): Record<number, number> {
    if (!total || total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    // Weight distribution around the average
    const weights: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (let star = 1; star <= 5; star++) {
        const distance = Math.abs(star - avg);
        weights[star] = Math.max(0, 1 - distance * 0.45);
    }

    const weightSum = Object.values(weights).reduce((a, b) => a + b, 0);
    let remaining = total;
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    [5, 4, 3, 2, 1].forEach((star, i, arr) => {
        if (i === arr.length - 1) {
            counts[star] = remaining;
        } else {
            counts[star] = Math.round((weights[star] / weightSum) * total);
            remaining -= counts[star];
        }
    });

    return counts;
}

function StarRow({ star, count, total }: { star: number; count: number; total: number }) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-2.5">
            <span className="text-xs text-gray-500 w-3 text-right shrink-0">{star}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-gray-400 w-6 text-right shrink-0">{count}</span>
        </div>
    );
}

function RatingStars({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = value >= star;
                const partial = !filled && value > star - 1;
                const pct = partial ? ((value - (star - 1)) * 100).toFixed(0) : "0";

                return (
                    <span key={star} className="relative w-5 h-5">
                        {/* Empty star */}
                        <Star className="w-5 h-5 text-gray-200 fill-gray-200 absolute inset-0" />
                        {/* Filled / partial star */}
                        <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: filled ? "100%" : `${pct}%` }}
                        >
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        </span>
                    </span>
                );
            })}
        </div>
    );
}

export default function ReviewsCard({ rating, ratingCount }: ReviewsCardProps) {
    const total = ratingCount ?? 0;
    const avg   = rating ?? 0;
    const dist  = getStarDistribution(avg, total);
    const hasRatings = total > 0 && avg > 0;

    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">Ratings</h2>

            {!hasRatings ? (
                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <Star className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">No ratings yet</p>
                    <p className="text-xs text-gray-300 text-center max-w-[180px]">
                        Ratings will appear here once customers complete their bookings
                    </p>
                </div>
            ) : (
                /* ── Rating summary ── */
                <div className="flex gap-6 items-start">
                    {/* Big score */}
                    <div className="flex flex-col items-center justify-center shrink-0 w-24">
                        <span className="text-5xl font-black text-gray-900 leading-none tracking-tight">
                            {avg.toFixed(1)}
                        </span>
                        <div className="mt-2">
                            <RatingStars value={avg} />
                        </div>
                        <span className="text-[11px] text-gray-400 mt-1.5 text-center">
                            {total} {total === 1 ? "rating" : "ratings"}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="w-px self-stretch bg-gray-100 shrink-0" />

                    {/* Bar breakdown */}
                    <div className="flex-1 flex flex-col gap-2 justify-center">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <StarRow
                                key={star}
                                star={star}
                                count={dist[star]}
                                total={total}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}