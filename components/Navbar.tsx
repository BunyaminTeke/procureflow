'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Cookie’den token alma
        const getTokenFromCookie = () => {
            const match = document.cookie.match(/(^| )token=([^;]+)/);
            return match ? match[2] : null;
        };

        setToken(getTokenFromCookie());
        setLoading(false);

        // Cookie değişikliklerini izlemek için interval
        const interval = setInterval(() => {
            setToken(getTokenFromCookie());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        // Cookie’yi sil
        document.cookie = 'token=; path=/; max-age=0';
        setToken(null);
        router.push('/login');
    };

    // Token kontrolü yapılana kadar hiçbir şey gösterme
    if (loading) return null;

    return (
        <header className="bg-gray-200 shadow-md border-b-amber-500">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <div className="text-2xl font-bold text-blue-600">Kurum Tedarik</div>
                <nav className="space-x-6 hidden md:flex">
                    <Link href="/" className="text-gray-700 hover:text-blue-600">Ana Sayfa</Link>
                    <Link href="/products" className="text-gray-700 hover:text-blue-600">Ürünler</Link>
                    <Link href="/about" className="text-gray-700 hover:text-blue-600">Hakkımızda</Link>
                    <Link href="/contact" className="text-gray-700 hover:text-blue-600">İletişim</Link>
                </nav>

                {token ? (
                    <button
                        onClick={handleLogout}
                        className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Çıkış Yap
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Giriş Yap
                    </Link>
                )}
            </div>
        </header>
    );
}
