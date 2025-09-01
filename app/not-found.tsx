"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react"; // Eğer lucide-react yüklü değilse ikon kaldırabilirsin

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-6">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 max-w-lg w-full text-center animate-fadeIn">
                <XCircle className="mx-auto text-red-500 w-20 h-20 mb-4 animate-bounce" />
                <h1 className="text-7xl font-extrabold text-white mb-4">404</h1>
                <p className="text-lg text-gray-300 mb-6">
                    Maalesef aradığınız sayfa bulunamadı.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105"
                >
                    Ana Sayfaya Dön
                </button>
            </div>
        </div>
    );
}
