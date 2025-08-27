"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300 py-6">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <p>© 2025 Kurum Tedarik. Tüm hakları saklıdır.</p>
                <div className="flex gap-4 mt-3 md:mt-0">
                    <Link href="/privacy" className="hover:text-white">Gizlilik</Link>
                    <Link href="/terms" className="hover:text-white">Şartlar</Link>
                </div>
            </div>
        </footer>
    );
}
