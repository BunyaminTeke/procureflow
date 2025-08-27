"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    const [currentUser, setCurrentUser] = useState<any>(null);


    useEffect(() => {
        const token = document.cookie.split("token=")[1];
        if (!token) {
            router.push("/login");
            return;
        }

        // Kullanıcı rolünü kontrol et
        const checkAdmin = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error("Yetkilendirme hatası");
                }

                const user = await res.json();
                setCurrentUser(user);


                if (user.role.toLowerCase() !== "admin") {
                    router.push("/login");
                    return;
                }

                // Eğer adminse talepleri çek
                const reqRes = await fetch("/api/request", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await reqRes.json();
                setRequests(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-red-600">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Hata Oluştu</h2>
                <p className="text-gray-700 mb-6 text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );

    // İstatistikler
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-gray-900 to-black text-white shadow-xl">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                    <p className="text-sm text-gray-400 mt-1">Yönetici Kontrol Merkezi</p>
                </div>
                <nav className="p-4 space-y-1">
                    <button className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-[#2479AE] to-[#309AD6] flex items-center space-x-3 shadow-md">
                        <span>📊</span>
                        <span>Dashboard</span>
                    </button>
                    <button
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-3"
                        onClick={() => router.push("/admin/requests")}
                    >
                        <span>📦</span>
                        <span>Talepler</span>
                    </button>
                    <button
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-3"
                        onClick={() => router.push("/admin/users")}
                    >
                        <span>👥</span>
                        <span>Kullanıcılar</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-3">
                        <span>📑</span>
                        <span>Raporlar</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-3">
                        <span>⚙️</span>
                        <span>Ayarlar</span>
                    </button>
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{currentUser?.name || currentUser?.email}</p>
                            <p className="text-xs text-gray-400">{currentUser?.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* İçerik */}
            <main className="flex-1 p-8 space-y-8 overflow-x-hidden">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 mt-2">Sistem istatistiklerini ve talepleri görüntüleyin</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Ara..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2479AE] focus:border-purple-500 outline-none transition-all w-64"
                            />
                        </div>
                        {/* <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold">A</span>
                        </div> */}
                    </div>
                </div>

                {/* Kartlar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-600">Toplam Talepler</h3>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <div className="h-5 w-5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2h6a1 1 0 011 1v1h1a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold mt-4 text-gray-800">{total}</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-600">Bekleyen</h3>
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <div className="h-5 w-5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h12M6 20h12M8 4v4a4 4 0 004 4 4 4 0 004-4V4M8 20v-4a4 4 0 014-4 4 4 0 014 4v4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold mt-4 text-amber-600">{pending}</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                style={{ width: total > 0 ? `${(pending / total) * 100}%` : "0%" }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-600">Onaylanan</h3>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <div className="h-5 w-5 text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold mt-4 text-green-600">{approved}</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                style={{ width: total > 0 ? `${(approved / total) * 100}%` : "0%" }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-600">Reddedilen</h3>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <div className="h-5 w-5 text-red-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold mt-4 text-red-600">{rejected}</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                                style={{ width: total > 0 ? `${(rejected / total) * 100}%` : "0%" }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Tablo */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-xl">Talepler Listesi</h3>
                        <div className="flex space-x-3">
                            {/* <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center">
                                <span className="mr-2">🔄</span>
                                Yenile
                            </button> */}
                            {/* <button className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center shadow-md">
                                <span className="mr-2">➕</span>
                                Yeni Ekle
                            </button> */}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-600 font-medium text-sm">
                                    <th className="p-4 font-semibold">ID</th>
                                    <th className="p-4 font-semibold">Çalışan</th>
                                    <th className="p-4 font-semibold">Ürün</th>
                                    <th className="p-4 font-semibold">Miktar</th>
                                    <th className="p-4 font-semibold">Durum</th>
                                    <th className="p-4 font-semibold text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-700">#{req.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-purple-600 text-sm">👤</span>
                                                </div>
                                                <span className="font-medium">{req.employee?.name || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium">{req.itemName}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                                                {req.quantity} adet
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {req.status === "pending" && (
                                                <span className="px-3 py-1.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center w-28">
                                                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                                                    Bekliyor
                                                </span>
                                            )}
                                            {req.status === "approved" && (
                                                <span className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-xl flex items-center justify-center w-28">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                    Onaylandı
                                                </span>
                                            )}
                                            {req.status === "rejected" && (
                                                <span className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded-xl flex items-center justify-center w-28">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                    Reddedildi
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end space-x-2">
                                                <button className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300">
                                                    Onayla
                                                </button>
                                                <button
                                                    className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300">
                                                    Reddet
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Toplam {requests.length} kayıt
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center">
                                <div className="h-5 w-5 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </div>
                                Önceki
                            </button>
                            <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl bg-gradient-to-r from-[#2479AE] to-indigo-600 text-white font-medium shadow-md">
                                1
                            </button>
                            <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center">
                                Sonraki
                                <div className="h-5 w-5 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}