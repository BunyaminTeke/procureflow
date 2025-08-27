'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Token cookie'sini sil
        document.cookie = 'token=; path=/; max-age=0';
        // Login sayfasına yönlendir
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
            Çıkış Yap
        </button>
    );
}
