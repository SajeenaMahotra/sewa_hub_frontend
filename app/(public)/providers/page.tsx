"use client";

import { useEffect, useState, useCallback } from "react";
import { ProviderCard, ProviderCardData } from "@/components/ui/ProviderCard";
import { getAllProviders } from "@/lib/api/provider";
import { getServiceCategories } from "@/lib/api/provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
    _id: string;
    category_name: string;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function ProviderCardSkeleton() {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
                <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-20 rounded-md" />
                </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrowseProvidersPage() {
    const router = useRouter();

    const [providers, setProviders] = useState<ProviderCardData[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const PAGE_SIZE = 12;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    // ── Fetch categories once ──────────────────────────────────────────────────
    useEffect(() => {
        getServiceCategories()
            .then((res) => setCategories(res.data ?? []))
            .catch(console.error);
    }, []);

    // ── Fetch providers ────────────────────────────────────────────────────────
    const fetchProviders = useCallback(
        async (nextPage: number, categoryId: string, replace: boolean) => {
            replace ? setLoading(true) : setLoadingMore(true);
            try {
                const res = await getAllProviders(
                    nextPage,
                    PAGE_SIZE,
                    categoryId === "all" ? undefined : categoryId
                );
                const incoming: ProviderCardData[] = res.data?.providers ?? [];
                setTotal(res.data?.total ?? 0);
                setProviders((prev) => (replace ? incoming : [...prev, ...incoming]));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        []
    );

    // Reset on category change
    useEffect(() => {
        setPage(1);
        fetchProviders(1, selectedCategory, true);
    }, [selectedCategory, fetchProviders]);

    // Load more
    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchProviders(next, selectedCategory, false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Find a Provider</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Browse verified professionals ready to help
                    </p>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`
                            px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                            ${selectedCategory === "all"
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                            }
                        `}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat._id)}
                            className={`
                                px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                                ${selectedCategory === cat._id
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                }
                            `}
                        >
                            {cat.category_name}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                {!loading && (
                    <p className="text-xs text-gray-400 mb-4">
                        {total} provider{total !== 1 ? "s" : ""} found
                    </p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProviderCardSkeleton key={i} />
                        ))}
                    </div>
                ) : providers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <p className="text-gray-400 text-sm">No providers found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {providers.map((provider) => (
                            <ProviderCard
                                key={provider._id}
                                provider={provider}
                                onClick={(id) => router.push(`/providers/${id}`)}
                            />
                        ))}

                        {/* Skeleton placeholders while loading more */}
                        {loadingMore &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <ProviderCardSkeleton key={`more-${i}`} />
                            ))}
                    </div>
                )}

                {/* Load more */}
                {!loading && page < totalPages && (
                    <div className="flex justify-center mt-10">
                        <Button
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="px-8"
                        >
                            {loadingMore ? "Loading..." : "Load more"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}