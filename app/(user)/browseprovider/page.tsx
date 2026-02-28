"use client";

import { useEffect, useState, useCallback } from "react";
import { ProviderCard, ProviderCardData } from "@/components/ui/ProviderCard";
import { getAllProviders, getServiceCategories } from "@/lib/api/provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

//  Types 
interface Category {
    _id: string;
    category_name: string;
}

type SortOption = "default" | "price_asc" | "price_desc" | "rating_desc" | "experience_desc";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: "Default",           value: "default"          },
    { label: "Price: Low → High", value: "price_asc"        },
    { label: "Price: High → Low", value: "price_desc"       },
    { label: "Top Rated",         value: "rating_desc"      },
    { label: "Most Experienced",  value: "experience_desc"  },
];

const PAGE_SIZE = 12;

//  Skeleton 
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

// ── Sort helper (client-side) 
function sortProviders(providers: ProviderCardData[], sort: SortOption): ProviderCardData[] {
    const arr = [...providers];
    switch (sort) {
        case "price_asc":        return arr.sort((a, b) => (a.price_per_hour ?? 0) - (b.price_per_hour ?? 0));
        case "price_desc":       return arr.sort((a, b) => (b.price_per_hour ?? 0) - (a.price_per_hour ?? 0));
        case "rating_desc":      return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        case "experience_desc":  return arr.sort((a, b) => (b.experience_years ?? 0) - (a.experience_years ?? 0));
        default:                 return arr;
    }
}

//  Page 
export default function BrowseProvidersPage() {
    const router       = useRouter();
    const searchParams = useSearchParams();

    const [allProviders, setAllProviders]     = useState<ProviderCardData[]>([]);  // full dataset
    const [categories, setCategories]         = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [search, setSearch]                 = useState(searchParams.get("search") ?? "");
    const [sort, setSort]                     = useState<SortOption>("default");
    const [sortOpen, setSortOpen]             = useState(false);
    const [page, setPage]                     = useState(1);
    const [total, setTotal]                   = useState(0);
    const [loading, setLoading]               = useState(true);
    const [loadingMore, setLoadingMore]       = useState(false);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    //  Fetch categories 
    useEffect(() => {
        getServiceCategories()
            .then((res) => setCategories(res.data ?? []))
            .catch(console.error);
    }, []);

    //  Fetch providers 
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
                setAllProviders((prev) => (replace ? incoming : [...prev, ...incoming]));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        []
    );

    useEffect(() => {
        setPage(1);
        fetchProviders(1, selectedCategory, true);
    }, [selectedCategory, fetchProviders]);

    // ── Client-side search + sort 
    const q = search.trim().toLowerCase();

    const afterSearch = q
        ? allProviders.filter((p) =>
            (p as any)?.Useruser_id?.fullname?.toLowerCase().includes(q) ||
            (p as any)?.category_id?.category_name?.toLowerCase().includes(q) ||
            p.bio?.toLowerCase().includes(q) 
          )
        : allProviders;

    const afterSort = sortProviders(afterSearch, sort);

    // ── Paginate the final result 
    const paginated  = afterSort.slice(0, page * PAGE_SIZE);
    const hasMore    = paginated.length < afterSort.length;

    // Active filter count (for badge)
    const activeFilterCount = [
        selectedCategory !== "all",
        sort !== "default",
        q.length > 0,
    ].filter(Boolean).length;

    const clearAll = () => {
        setSearch("");
        setSelectedCategory("all");
        setSort("default");
        setPage(1);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            {/* ── Header ── */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Find a Provider</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Browse verified professionals ready to help
                </p>
            </div>

            {/* ── Search + Sort bar ── */}
            <div className="flex gap-3 mb-5">
                {/* Search input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name, category, location…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setSortOpen((o) => !o)}
                        className="flex items-center gap-2 h-[42px] px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 transition whitespace-nowrap"
                    >
                        <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                        {SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort"}
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                    </button>

                    {sortOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setSort(opt.value); setSortOpen(false); setPage(1); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                                        ${sort === opt.value
                                            ? "bg-orange-50 text-[#EE7A40] font-semibold"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Category filter pills ── */}
            <div className="flex flex-wrap gap-2 mb-5">
                <button
                    onClick={() => { setSelectedCategory("all"); setPage(1); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                        ${selectedCategory === "all"
                            ? "bg-[#EE7A40] text-white border-[#EE7A40]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                            ${selectedCategory === cat._id
                                ? "bg-[#EE7A40] text-white border-[#EE7A40]"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                            }`}
                    >
                        {cat.category_name}
                    </button>
                ))}
            </div>

            {/* ── Results bar ── */}
            {!loading && (
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-gray-400">
                        {afterSort.length} provider{afterSort.length !== 1 ? "s" : ""} found
                        {q && <span className="ml-1">for "<span className="text-gray-600 font-medium">{q}</span>"</span>}
                    </p>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1 text-xs text-[#EE7A40] hover:text-orange-600 font-semibold"
                        >
                            <X className="w-3 h-3" />
                            Clear all filters
                            <span className="ml-0.5 bg-[#EE7A40] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                {activeFilterCount}
                            </span>
                        </button>
                    )}
                </div>
            )}

            {/* ── Grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => <ProviderCardSkeleton key={i} />)}
                </div>
            ) : afterSort.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                    <p className="text-gray-500 font-medium text-sm">No providers found</p>
                    <p className="text-gray-400 text-xs">
                        {q ? `No results for "${q}". Try a different search.` : "No providers in this category yet."}
                    </p>
                    {activeFilterCount > 0 && (
                        <button onClick={clearAll} className="text-xs text-[#EE7A40] font-semibold underline underline-offset-2 mt-1">
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginated.map((provider) => (
                        <ProviderCard
                            key={provider._id}
                            provider={provider}
                            onClick={(id) => router.push(`/providers-detail/${id}`)}
                        />
                    ))}
                    {loadingMore && Array.from({ length: 4 }).map((_, i) => (
                        <ProviderCardSkeleton key={`more-${i}`} />
                    ))}
                </div>
            )}

            {/* ── Load more ── */}
            {!loading && hasMore && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => {
                            const next = page + 1;
                            setPage(next);
                            // fetch more from server if we've exhausted current allProviders
                            if (next * PAGE_SIZE > allProviders.length && next <= totalPages) {
                                fetchProviders(next, selectedCategory, false);
                            }
                        }}
                        disabled={loadingMore}
                        className="px-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-[#EE7A40] hover:text-[#EE7A40] disabled:opacity-50 transition"
                    >
                        {loadingMore ? "Loading…" : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
}