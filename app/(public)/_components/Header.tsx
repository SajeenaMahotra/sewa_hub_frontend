"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper function to get initials
  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  // While loading auth state, show nothing for auth buttons to prevent flash
  const renderAuthButtons = () => {
    if (loading) return null;

    if (isAuthenticated && user) {
        // determine user image field and construct absolute URL when needed
        const rawImage = user.imageUrl || user.profileImage || user.image || user.image_url;
        const imageSrc = rawImage
          ? rawImage.startsWith("http")
            ? rawImage
            : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050"}${rawImage}`
          : undefined;

        return (
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-9 h-9">
              <AvatarImage src={imageSrc || undefined} />
              <AvatarFallback className="text-sm bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                {getInitials(user.fullname)}
              </AvatarFallback>
            </Avatar>
          </Link>
        );
    }

    return (
      <>
        <Link
          href="/login"
          className="h-9 px-4 inline-flex items-center justify-center rounded-md bg-[#EE7A40] text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-[#EE7A40] text-[#EE7A40] text-sm font-semibold hover:bg-orange-50 transition-colors"
        >
          Sign Up
        </Link>
      </>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 border-b border-black/10 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] w-full">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
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
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  isActive(link.href) ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Auth + Mobile Toggle */}
          <div className="flex items-center gap-2 md:justify-self-end">
            {/* Desktop Auth */}
            <div className="hidden sm:flex items-center gap-2">{renderAuthButtons()}</div>

            {/* Mobile Menu */}
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
                  <nav className="mt-8 flex flex-col gap-4">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm font-medium transition-colors ${
                          isActive(link.href) ? "text-orange-500" : "text-foreground/80"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto flex flex-col gap-2">
                    {!loading && !isAuthenticated && (
                      <>
                        <Link
                          href="/login"
                          className="h-9 px-4 inline-flex items-center justify-center rounded-md bg-[#EE7A40] text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          className="h-9 px-4 inline-flex items-center justify-center rounded-md border border-[#EE7A40] text-[#EE7A40] text-sm font-semibold hover:bg-orange-50 transition-colors"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                    {isAuthenticated && user && (
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3 p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        {(() => {
                          const rawImage = user.imageUrl || user.profileImage || user.image || user.image_url;
                          const imageSrc = rawImage
                            ? rawImage.startsWith("http")
                              ? rawImage
                              : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050"}${rawImage}`
                            : undefined;

                          return (
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={imageSrc || undefined} />
                              <AvatarFallback className="text-sm bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                                {getInitials(user.fullname)}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })()}
                        <span className="font-semibold text-gray-900">{user.fullname}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}