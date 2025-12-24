"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact Us" },
];

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

    return (
        <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-black/10 dark:border-white/10">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] w-full">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/sewahublogo.png"
                                alt="Sewahub Logo"
                                width={150}
                                height={150}
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Center: Desktop Nav */}
                    <div className="hidden md:flex items-center gap-20 justify-self-center">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={
                                    "text-sm font-medium transition-colors hover:text-orange-500 " +
                                    (isActive(link.href) ? "text-foreground" : "text-foreground/60")
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Auth + Mobile Toggle */}
                    <div className="flex items-center gap-2 md:justify-self-end">
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="h-9 px-4 inline-flex items-center justify-center rounded-md bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-orange-500 text-orange-500 text-sm font-semibold hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>

                        {/* Theme toggle */}
                        {/* <ThemeToggle /> */}

                        {/* Mobile Menu (shadcn Sheet) */}
                        {/* Mobile Menu (shadcn Sheet) */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="md:hidden"
                                    aria-label="Open menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-72 px-6">
                                <div className="flex h-full flex-col">

                                    {/* Nav links */}
                                    <nav className="mt-8 flex flex-col gap-4">
                                        {NAV_LINKS.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={
                                                    "text-sm font-medium transition-colors " +
                                                    (isActive(link.href)
                                                        ? "text-orange-500"
                                                        : "text-foreground/80")
                                                }
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>

                                    {/* Auth buttons */}
                                    <div className="mt-auto flex flex-col gap-3 pt-6">
                                        <Button
                                            asChild
                                            className="bg-orange-500 text-white hover:bg-orange-600"
                                        >
                                            <Link href="/login">Login</Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            asChild
                                            className="border-orange-500 text-orange-500 hover:bg-orange-50"
                                        >
                                            <Link href="/register">Sign Up</Link>
                                        </Button>
                                    </div>

                                </div>
                            </SheetContent>
                        </Sheet>


                    </div>
                </div>

                {/* Mobile panel */}
                <div className={"md:hidden overflow-hidden transition-[max-height] duration-300 " + (open ? "max-h-96" : "max-h-0")}>
                    <div className="pb-4 pt-2 border-t border-black/10 dark:border-white/10">
                        <div className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={
                                        "rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-orange-500/10 " +
                                        (isActive(link.href) ? "text-foreground" : "text-foreground/70")
                                    }
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="mt-2 flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="flex-1 h-9 px-3 inline-flex items-center justify-center rounded-md bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 h-9 px-3 inline-flex items-center justify-center rounded-md border border-orange-500 text-orange-500 text-sm font-semibold hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}