import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';

export default function Footer() {
    return (
        <footer  id ="contact" className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-5">
                        <Image
                            src="/sewahublogo.png"
                            alt="SewaHub Logo"
                            width={150}
                            height={50}
                            className="object-contain"
                        />

                        <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                            Connecting you with trusted service providers for all your home and business needs. Quality services, delivered with care.
                        </p>
                        <Button
                            className="bg-[#EE7A40] hover:bg-[#d66a35] text-white font-semibold"
                            asChild
                        >
                            <Link href="/book">Book a service</Link>
                        </Button>
                    </div>

                    <div>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                                >
                                    Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Social
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://twitter.com/sewahub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                                >
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://instagram.com/sewahub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                                >
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://facebook.com/sewahub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                                >
                                    Facebook
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Contact
                        </h3>
                        <div className="text-gray-600 text-sm space-y-2">
                            <p>+977 0000000000</p>
                            <p>sewahubcustomer@gmail.com</p>
                            <p>Kathmandu, Nepal</p>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 sewahub.com All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="/terms"
                            className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                        >
                            Terms and Conditions
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}